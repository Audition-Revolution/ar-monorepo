import {gql} from "apollo-boost";

export const GET_TAGS_FOR_TAG_PAGE = gql`
    {
        getTagsForTagsPage {
            id
            tag
            for {
                id
                firstName
                lastName
                email
                representation
                city
                state
                gender
                phoneNumber
                website
                eyeColor
                hairColor
                heightInches
                breakdown {
                    ageRange
                    gender
                    unions
                    ethnicity
                    vocalRange
                }
                profilePicture {
                    url
                }
            }
        }
    }
`;
