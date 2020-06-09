import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography
} from "@material-ui/core";
import AddSkillModal from "../../components/profile/AddSkillModal";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import React, { FC, useEffect, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import { MakeDraggable } from "./ExperienceSection";
import styled from "styled-components";

interface IResumeSection {
  title: string;
  readOnly: boolean;
  items: any[];
  type: "skill" | "training";
  profileOrder: string[];
  userId: string;
}

const GET_USER = require("../../graphql/queries/user/GET_USER.graphql");

const REMOVE_SKILL = gql`
  mutation removeSkillOrTraining($type: String!, $text: String!) {
    removeSkillOrTraining(type: $type, text: $text)
  }
`;

const REORDER_SKILL = gql`
  mutation reorderSkillsOrTraining(
    $type: String!
    $skillOrder: [ExperienceOrder!]
  ) {
    reorderSkillOrTraining(type: $type, skillOrder: $skillOrder)
  }
`;

const ResumeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: .8rem;
  margin-bottom: .8rem;
`;

const ResumeSection: FC<IResumeSection> = props => {
  const [reorder, setReorder] = useState(false);
  const [, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [skillItems, setSkillItems] = useState([] as any[]);
  const [reorderSkillsOrTraining] = useMutation(REORDER_SKILL);
  const onDragEnd = (result: any) => {
    const newOrder: any[] = [...skillItems];
    newOrder.splice(
      result.destination.index,
      0,
      newOrder.splice(result.source.index, 1)[0]
    );
    setSkillItems(newOrder as any[]);
  };
  useEffect(() => {
    const sorted = props.items.sort((a: any, b: any) => a.index - b.index);
    setSkillItems(sorted);
  }, [props.items, props.items.length]);

  const handleReorder = () => {
    setAnchorEl(null);
    if (reorder) {
      const indexedItems = skillItems.map((item: any, index: number) => ({
        id: item.id,
        index
      }));
      reorderSkillsOrTraining({
        variables: {
          type: props.type,
          skillOrder: indexedItems
        }
      });
    }
    setReorder(!reorder);
  };

  return (
    <>
      <ResumeHeader>
        <Typography variant={"h4"}>{props.title}</Typography>
        {!props.readOnly && (
          <div>
            <Button onClick={handleReorder}>
              {reorder ? "Save Order" : "Reorder " + props.type}
            </Button>
            <AddSkillModal type={props.type} />
          </div>
        )}
      </ResumeHeader>
      <div>
        <Card>
          <CardContent>
            <List>
              <MakeDraggable
                draggable={reorder}
                items={skillItems}
                onDragEnd={onDragEnd}
                readOnly={props.readOnly}
              >
                <ResumeListItem {...props} />
              </MakeDraggable>
            </List>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

function ResumeListItem(props: any) {
  const [removeSkill] = useMutation(REMOVE_SKILL, {
    refetchQueries: [{ query: GET_USER, variables: { id: props.userId } }]
  });
  return (
    <>
      <ListItem alignItems="flex-start"  style={{margin: "1.2rem 0"}}>
        <Typography variant={"h6"}>{props.text}</Typography>
        {!props.readOnly && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() =>
                removeSkill({
                  variables: {
                    type: props.type,
                    text: props.text
                  }
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Divider />
    </>
  );
}

export default ResumeSection;
