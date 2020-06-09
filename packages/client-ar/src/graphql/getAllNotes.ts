import {gql} from "apollo-boost";

export const GET_ALL_NOTES = gql`
    query getAllNotes {
        getAllNotes {
            id
            for {
                id
                firstName
                lastName
            }
            text
        }
    }
`;

