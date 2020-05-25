import React, { FC } from "react";
import { List } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import AddNoteForActor from "./AddNoteForActor";
import NoteItem from "./NoteItem";

const GET_NOTES = require("../../graphql/queries/GET_NOTES.graphql");

const NotesOnActor: FC<any> = ({ userId, auditionId }) => {
  const { loading, data } = useQuery(GET_NOTES, {
    variables: { actorId: userId }
  });
  if (loading) {
    return <h1>Loading</h1>;
  }
  const notes = data.getNotes;
  return (
    <div>
      <AddNoteForActor userId={userId} auditionId={auditionId} />
      <List>
        {notes.map((note: any) => (
          <NoteItem key={note.id} note={note} userId={userId} />
        ))}
      </List>
    </div>
  );
};

export default NotesOnActor;
