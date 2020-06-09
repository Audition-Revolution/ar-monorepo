import {gql} from "apollo-boost";

export const REORDER_EXPERIENCE = gql`
    mutation reorderExperience($data: ReorderExperienceDTO!) {
        reorderExperience(data: $data)
    }
`;

export const GET_EXPERIENCE = gql`
    query getExperience($data: ReorderExperienceDTO!) {
        getExperience(data: $data) {
            id
            role
            project
            company
            director
            index
        }
    }
`;

export const CHANGE_EXPERIENCE_ORDER = gql`
    mutation changeExperienceOrder($newExperiences: [ExperienceType!]!) {
        changeExperienceOrder(newExperiences: $newExperiences)
    }
`;
