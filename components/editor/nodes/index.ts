import { PresentationNode } from "./presentation-node";
import { SingleChoiceNode } from "./single-choice-node";
import { MultipleChoiceNode } from "./multiple-choice-node";
import { RatingNode } from "./rating-node";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nodeTypes: any = {
  presentation: PresentationNode,
  singleChoice: SingleChoiceNode,
  multipleChoice: MultipleChoiceNode,
  rating: RatingNode,
};

export { PresentationNode, SingleChoiceNode, MultipleChoiceNode, RatingNode };
