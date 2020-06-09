import React, { useState } from "react";
import GoBackButton from "../../components/shared/GoBackButton";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router";
import { Typography } from "@material-ui/core";
import {GET_MY_INSTANCE, UPDATE_ANSWER} from "../../graphql/miscQueries";

const AnswerInput = ({ question }: any) => {
  const { instanceId } = useParams();
  const [updateAnswer] = useMutation(UPDATE_ANSWER, {
    refetchQueries: [{ query: GET_MY_INSTANCE, variables: { instanceId } }]
  });
  const [answer, setAnswer] = useState(question.answer.text);
  const saveAnswer = () => {
    updateAnswer({
      variables: {
        answerId: question.answer.id,
        text: answer
      }
    });
  };
  return (
    <div>
      <p>{question.text}</p>
      <input value={answer} onChange={e => setAnswer(e.target.value)} />
      <button onClick={saveAnswer}>Save Answer</button>
    </div>
  );
};
const MyAuditionInstance = () => {
  const { instanceId } = useParams();
  const { data, loading } = useQuery(GET_MY_INSTANCE, {
    variables: { instanceId }
  });

  if (loading) {
    return <h1>loading</h1>;
  }
  const instance = data.getInstance;
  return (
    <div>
      <GoBackButton />
      <Typography variant={"h3"}>{instance.audition.name}</Typography>
      <div>
        {instance.questions.map((question: any) => (
          <AnswerInput question={question} />
        ))}
      </div>
    </div>
  );
};

export default MyAuditionInstance;
