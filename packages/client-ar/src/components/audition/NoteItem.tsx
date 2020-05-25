import React, { FC } from "react";
import { useMutation } from "@apollo/react-hooks";
import moment from "moment";
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const GET_NOTES = require("../../graphql/queries/GET_NOTES.graphql");
const REMOVE_NOTE = require("../../graphql/mutations/REMOVE_NOTE.graphql");

const NoteItem: FC<any> = ({ note, userId }) => {
  const [removeNote] = useMutation(REMOVE_NOTE, {
    variables: { id: note.id },
    refetchQueries: [
      {
        query: GET_NOTES,
        variables: { actorId: userId }
      }
    ]
  });
  const formattedUnixTime = Math.floor(note.createdAt / 1000);
  const date = moment.unix(formattedUnixTime).calendar();
  const secondary = note.audition
    ? `${date} during ${note.audition.name}`
    : `${date} on Profile`;
  return (
    <ListItem key={note.id}>
      <ListItemText id={note.id} primary={note.text} secondary={secondary} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => removeNote()}
          edge="end"
          aria-label="comments"
        >
          <HighlightOffIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NoteItem;
