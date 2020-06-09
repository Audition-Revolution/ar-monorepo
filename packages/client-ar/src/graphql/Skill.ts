import {gql} from "apollo-boost";

export const REMOVE_SKILL = gql`
    mutation removeSkillOrTraining($type: String!, $text: String!) {
        removeSkillOrTraining(type: $type, text: $text)
    }
`;

export const REORDER_SKILL = gql`
    mutation reorderSkillsOrTraining(
        $type: String!
        $skillOrder: [ExperienceOrder!]
    ) {
        reorderSkillOrTraining(type: $type, skillOrder: $skillOrder)
    }
`;
