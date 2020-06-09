import {gql} from "apollo-boost";

export const ADD_SKILL = gql`
    mutation addSkillOrTraining($type: String!, $text: String!) {
        addSkillOrTraining(type: $type, text: $text)
    }
`;
