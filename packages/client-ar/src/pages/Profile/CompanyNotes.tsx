import React, { FC } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Card, CardContent, Container, Typography } from "@material-ui/core";
import {GET_ALL_NOTES} from "../../graphql/getAllNotes";

const CompanyNotes: FC<any> = () => {
  const { data, loading } = useQuery(GET_ALL_NOTES);

  if (loading) {
    return <h1>loading</h1>;
  }
  const notes = data.getAllNotes;
  return (
    <Container>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Recent Notes
          </Typography>
          {notes.map((note: any) => (
            <p key={note.id}>
              {note.text} -{" "}
              <a href={"/profile/" + note.for.id}>
                {note.for.firstName} {note.for.lastName}
              </a>
            </p>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CompanyNotes;
