import {gql} from "apollo-boost";

export const GET_MY_INSTANCE = gql`
    query getInstance($instanceId: String!) {
        getInstance(instanceId: $instanceId) {
            id
            decision
            audition {
                id
                name
                auditionType
                requirementSummary
                address
                startDate
                description
            }
            timeSlot {
                id
                startTime
                endTime
            }
            questions {
                id
                text
                answer {
                    id
                    text
                }
            }
        }
    }
`;

export const UPDATE_ANSWER = gql`
    mutation updateAnswer($answerId: String!, $text: String!) {
        updateAnswer(answerId: $answerId, text: $text)
    }
`;

