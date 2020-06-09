import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Button, TextField } from "@material-ui/core";
import styled from "styled-components";

const ADD_NOTE = require("../../graphql/mutations/ADD_NOTE.graphql");
const GET_NOTES = require("../../graphql/queries/GET_NOTES.graphql");

const AddNoteFormStyles = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  
  .note-value {
    margin-bottom: 1.6rem;
  }
  .note-button {
    margin-top: .6rem;
  }
`;

const AddNoteForActor: FC<any> = ({ userId, auditionId }) => {
  const [noteValue, setNoteValue] = useState("");

  const [addNote] = useMutation(ADD_NOTE, {
    variables: {
      input: { for: userId, audition: auditionId, text: noteValue }
    },
    refetchQueries: [
      {
        query: GET_NOTES,
        variables: { actorId: userId }
      }
    ]
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addNote();
    setNoteValue("");
  };

  return (
    <AddNoteFormStyles
      name="registerForm"
      noValidate
      onSubmit={handleSubmit}
    >
      <TextField
        className="note-value"
        label="Add Notes Here..."
        type="note"
        name="note"
        value={noteValue}
        onChange={e => setNoteValue(e.target.value)}
      />
      <Button
        type="submit"
        className="note-button"
        variant="contained"
        size="small"
        color="primary"
      >
        Add Note
      </Button>
    </AddNoteFormStyles>
  );
};

export default AddNoteForActor;
