import {gql} from "apollo-boost";

export const UPDATE_USER = gql`
    mutation updateUser($data: UserDataDTO!) {
        updateUser(data: $data)
    }
`;
