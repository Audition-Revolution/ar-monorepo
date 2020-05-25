import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Button, TextField } from "@material-ui/core";

const ADD_NOTE = require("../../graphql/mutations/ADD_NOTE.graphql");
const GET_NOTES = require("../../graphql/queries/GET_NOTES.graphql");

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
    <form
      name="registerForm"
      noValidate
      className="flex flex-col justify-center w-full"
      onSubmit={handleSubmit}
    >
      <TextField
        className="mb-16"
        label="Add Notes Here..."
        type="note"
        name="note"
        value={noteValue}
        onChange={e => setNoteValue(e.target.value)}
      />
      <Button
        type="submit"
        className="mt-6"
        variant="contained"
        size="small"
        color="primary"
      >
        Add Note
      </Button>
    </form>
  );
};

export default AddNoteForActor;
