import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getFirebaseAdmin } from "./firebase-admin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { db } = getFirebaseAdmin();

          // Referência ao documento do usuário
          const userRef = db.collection("users").doc(user.id);
          const userDoc = await userRef.get();

          if (!userDoc.exists) {
            // Criar novo usuário
            await userRef.set({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            // Atualizar dados do usuário existente
            await userRef.update({
              name: user.name,
              email: user.email,
              image: user.image,
              updatedAt: new Date().toISOString(),
            });
          }

          return true;
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
          // Permitir login mesmo se falhar ao salvar (graceful degradation)
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      // Adicionar o ID do usuário à sessão
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
