import {gql} from "apollo-boost";

export const GET_DISTINCT_TAGS = gql`
    {
        getDistinctTags {
            tags
        }
    }
`;

export const CREATE_TAG = gql`
    mutation createTag($input: CreateTagDTO!) {
        createTag(input: $input)
    }
`;

export const GET_TAGS_FOR_ACTOR = gql`
    query getTags($id: String!) {
        getTagsForActor(id: $id) {
            tags
        }
    }
`;

export const DELETE_TAG = gql`
    mutation deleteTag($input: CreateTagDTO!) {
        deleteTag(input: $input)
    }
`;


export const GET_TAGS_FOR_OWNER = gql`
    {
        getTagsForOwner {
            id
            tag
            for {
                id
                firstName
                lastName
                email
                profilePicture {
                    url
                }
            }
        }
    }
`;

