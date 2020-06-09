import React, { FC, useEffect, useState } from "react";
import { Button, Chip, TextField } from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Autocomplete } from "@material-ui/lab";
import {GET_TAGS_FOR_OWNER} from "../../pages/Profile/MyTags";
import styled from "styled-components";

const GET_DISTINCT_TAGS = gql`
  {
    getDistinctTags {
      tags
    }
  }
`;

const CREATE_TAG = gql`
  mutation createTag($input: CreateTagDTO!) {
    createTag(input: $input)
  }
`;

export const GET_TAGS_FOR_ACTOR = gql`
  query getTags($id: String!) {
    getTagsForActor(id: $id) {
      tags
    }
  }
`;

const DELETE_TAG = gql`
  mutation deleteTag($input: CreateTagDTO!) {
    deleteTag(input: $input)
  }
`;

const TagsOnActorStyle = styled.div`
  .tags-form {
    display: flex;
    justify-content: space-between;
  }
  
  .MuiAutocomplete-root {
    width: 75%;
  }
  
  .tag-chip {
    margin: .5rem;
  }
`

const TagsOnActor: FC<any> = ({ userId }) => {
  const [value, setValue] = useState("");
  const { loading, data } = useQuery(GET_DISTINCT_TAGS);
  const { data: allTags } = useQuery(GET_TAGS_FOR_ACTOR, {
    variables: { id: userId }
  });
  const [createTag] = useMutation(CREATE_TAG, {
    refetchQueries: [
      { query: GET_TAGS_FOR_OWNER },
      { query: GET_TAGS_FOR_ACTOR, variables: { id: userId } },
      { query: GET_DISTINCT_TAGS }
    ]
  });

  const [deleteTag] = useMutation(DELETE_TAG, {
    refetchQueries: [
      { query: GET_TAGS_FOR_ACTOR, variables: { id: userId } },
      { query: GET_DISTINCT_TAGS }
    ]
  });

  const { tags } = data?.getDistinctTags || { tags: [] };
  const [options, setOptions] = useState([value, "My Talent", ...tags]);
  useEffect(() => {
    let withVal;
    if (tags.indexOf("My Talent") === -1) {
      withVal = [value, "My Talent", ...tags];
    } else {
      withVal = [value, ...tags];
    }
    setOptions(withVal.filter((text: string) => text.includes(value)));
  }, [tags, value]);

  if (loading) {
    return <h1>Loading</h1>;
  }

  const actorTags = allTags?.getTagsForActor?.tags || [];

  const handleClick = () => {
    createTag({
      variables: {
        input: {
          tag: value,
          for: userId
        }
      }
    });
    setValue("");
  };

  return (
    <TagsOnActorStyle>
      <div className={"tags-form"}>
        <Autocomplete
          options={options}
          onInputChange={(e: any, newVal: any) => setValue(newVal)}
          onChange={(e: any, newVal: any) => setValue(newVal)}
          value={value}
          renderInput={(params: any) => <TextField fullWidth {...params} />}
        />
        <Button color={"primary"} variant="contained" onClick={handleClick}>
          Save Tag
        </Button>
      </div>
      <div>
        {actorTags.map((tag: string) => (
          <Chip
            className="tag-chip"
            size="small"
            label={tag}
            onDelete={() =>
              deleteTag({
                variables: {
                  input: {
                    tag,
                    for: userId
                  }
                }
              })
            }
          />
        ))}
      </div>
    </TagsOnActorStyle>
  );
};

export default TagsOnActor;
