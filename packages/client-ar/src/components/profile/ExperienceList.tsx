import React, { FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { Button, Card, CardContent, CardHeader } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { gql } from "apollo-boost";
import styled from "styled-components";

const REMOVE_EXPERIENCE = require("../../graphql/mutations/profile/REMOVE_EXPERIENCE.graphql");
const REORDER_EXPERIENCE = gql`
  mutation reorderExperience($data: ReorderExperienceDTO!) {
    reorderExperience(data: $data)
  }
`;

export const GET_EXPERIENCE = gql`
  query getExperience($data: ReorderExperienceDTO!) {
    getExperience(data: $data) {
      id
      role
      project
      company
      director
      index
    }
  }
`;


const ListItemTextStyles = styled.div`
  display: flex;
  width: 100%;
  
  .header {
    font-size: 1.8rem;
    width: 25%;
  }
`;

const ExperienceList: FC<any> = ({
  value,
  type,
  id,
  readOnly,
  draggable = false
}) => {
  const [, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [reorderExperienceItems, setReorderExperienceItems] = useState(false);
  const [removeExperience] = useMutation(REMOVE_EXPERIENCE, {
    refetchQueries: [
      {
        query: GET_EXPERIENCE,
        variables: {
          data: {
            userId: id,
            experienceType: value
          }
        }
      }
    ]
  });
  const { data } = useQuery(GET_EXPERIENCE, {
    variables: {
      data: {
        userId: id,
        experienceType: value
      }
    },
    skip: !id
  });
  const [reorderExperience] = useMutation(REORDER_EXPERIENCE);
  const [expItems, setExpItems] = useState([] as any);
  const experiences = data?.getExperience || [];
  useEffect(() => {
    const sorted = experiences.sort((a: any, b: any) => a.index - b.index);
    setExpItems(sorted);
  }, [experiences]);

  const onDragEnd = (result: any) => {
    const newOrder: any[] = [...expItems];
    newOrder.splice(
      result.destination.index,
      0,
      newOrder.splice(result.source.index, 1)[0]
    );
    setExpItems(newOrder as any[]);
  };

  const handleReorderItemsToggle = () => {
    setAnchorEl(null);
    if (reorderExperienceItems) {
      const indexedItems = expItems.map((item: any, index: number) => ({
        id: item.id,
        index
      }));
      reorderExperience({
        variables: {
          data: {
            experienceType: value,
            experienceOrder: indexedItems
          }
        }
      });
    }
    setReorderExperienceItems(!reorderExperienceItems);
  };

  if (!expItems) {
    return <h1>loading</h1>;
  }

  if (!expItems.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={
          <>
            {draggable && <DragIndicatorIcon />} {type}
          </>
        }
        action={
          !readOnly && (
            <Button onClick={handleReorderItemsToggle}>
              {reorderExperienceItems ? "Save Items" : "Reorder"}
            </Button>
          )
        }
        style={{paddingBottom: 0}}
      />
      <CardContent style={{paddingTop: 0}}>
        <DragDropContext onDragEnd={onDragEnd}>
          {reorderExperienceItems ? (
            <Droppable droppableId="experienceItemsDroppable">
              {(provided: any) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  <ListItem>
                    <ListItemTextStyles>
                      <div className={"header"}>
                        <strong>Project: </strong>
                      </div>
                      <div className={"header"}>
                        <strong>Role:</strong>
                      </div>
                      <div className={"header"}>
                        <strong>Company: </strong>
                      </div>
                      <div className={"header"}>
                        <strong>Director: </strong>
                      </div>
                    </ListItemTextStyles>
                  </ListItem>
                  {expItems.map((exp: any, index: number) => (
                    <Draggable key={exp.id} draggableId={exp.id} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListItem
                            alignItems="flex-start"
                            style={{margin: '1.2rem 0'}}
                          >
                            <ListItemIcon>
                              <DragIndicatorIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <div style={{display: 'flex'}}>
                                  <div style={{width: '25%'}}>{exp.project}</div>
                                  <div style={{width: '25%'}}>{exp.role}</div>
                                  <div style={{width: '25%'}}>{exp.company}</div>
                                  <div style={{width: '25%'}}>{exp.director}</div>
                                </div>
                              }
                              secondary={exp.description}
                            />
                          </ListItem>
                          <Divider />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          ) : (
            <List>
              <ListItem>
                <ListItemTextStyles>
                  <div className={"header"}>
                    <strong>Project: </strong>
                  </div>
                  <div className={"header"}>
                    <strong>Role:</strong>
                  </div>
                  <div className={"header"}>
                    <strong>Company: </strong>
                  </div>
                  <div className={"header"}>
                    <strong>Director: </strong>
                  </div>
                </ListItemTextStyles>
              </ListItem>
              {expItems.map((exp: any, i: number) => (
                <React.Fragment key={i}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <div style={{display: 'flex'}}>
                          <div style={{width: '25%'}}>{exp.project}</div>
                          <div style={{width: '25%'}}>{exp.role}</div>
                          <div style={{width: '25%'}}>{exp.company}</div>
                          <div style={{width: '25%'}}>{exp.director}</div>
                        </div>
                      }
                      secondary={exp.description}
                    />
                    {!readOnly && (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() =>
                            removeExperience({
                              variables: {
                                data: {
                                  experienceType: value,
                                  experienceId: exp.id
                                }
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
                </React.Fragment>
              ))}
            </List>
          )}
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default ExperienceList;
