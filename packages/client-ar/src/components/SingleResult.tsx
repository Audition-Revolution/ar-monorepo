import {Button, Chip, makeStyles, Theme, Typography} from "@material-ui/core";
import React, {FC} from "react";
import {useQuery} from "@apollo/react-hooks";
import AddTags from "./profile/AddTags";
import AddNotes from "./profile/AddNotes";
import styled from "styled-components";
import {GET_TAGS_FOR_ACTOR} from "../graphql/Tags";

interface SingleResultProps {
    actor: Record<string, any>,
    handleClickTalent: (id: string) => void
    includeEmail: boolean
}

function findUnion(actor: Record<string, any>) {
    let unions = 'Union Status Unknown';
    if (actor.breakdown.length) {
        const unionArray = actor.breakdown.filter((breakdown: Record<string, any>) => {
            return breakdown.category === 0
        });
        if (unionArray.length === 1) {
            unions = unionArray[0].value
        } else {
            unions = unionArray.map((u: any) => u.value).sort().join(', ')
        }
    }
    return unions
}

const useStyles = makeStyles((theme: Theme) => ({
    bigAvatar: {
        width: 'auto',
        maxWidth: 80,
        height: 'auto',
        maxHeight: 100,
        borderRadius: 5
    }
}));

const SingleResultStyles = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: .3rem 0;
    
    .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: .8rem;
        padding-right: 0rem;
        margin: 2px;
        width: 80px; 
        height: 100px;
    }
    
    .information-container {
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: .25rem;
        flex-direction: column;
        display: flex;
    }
    
    .contact-info {
        width: 30%;
        display: flex;
        flex-direction: column;
        text-align: right;
        margin-right: 1.6rem;
    }
`;

const SingleResult: FC<SingleResultProps> = ({actor, handleClickTalent, includeEmail}) => {
    const classes = useStyles();
    const {data} = useQuery(GET_TAGS_FOR_ACTOR, {
        variables: {id: actor.id}
    });
    const tags = data?.getTagsForActor?.tags;

    return (
        <SingleResultStyles key={actor.id}>
            <div className="image-container" onClick={() => handleClickTalent(actor.id)}>
                <img
                    alt={`${actor.firstName} ${actor.lastName} profile`}
                    src={actor.profilePicture}
                    className={classes.bigAvatar}
                />
            </div>
            <div
                onClick={() => handleClickTalent(actor.id)}
                className="information-container">
                <Typography variant="h6">
                    {actor.firstName} {actor.lastName}
                </Typography>
                {actor.city && actor.state && (
                    <Typography variant="body1">
                        {actor.city}, {actor.state}
                    </Typography>
                )}
                <Typography variant="body1">
                    {findUnion(actor)}
                </Typography>
                <div style={{marginTop: 'auto'}}>
                    {tags?.length ? (
                        <Typography variant="body1">Tags:
                            {tags?.map((tagName: string) => (
                                <Chip
                                    key={tagName}
                                    style={{margin: '0 .25rem'}}
                                    size={'small'}
                                    label={tagName}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Typography>
                    ) : ''}
                </div>
            </div>
            <div className={'contact-info'}>
                {includeEmail && (
                    <Typography variant="body1">
                        Email:{'  '}
                        <a style={{color: '#2196f3'}}
                           href={`mailto://${actor.email}}`}>{actor.email}</a>
                    </Typography>
                )}
                <div>
                    <AddTags user={actor}
                             trigger={(props: any) => <Button style={{marginRight: '.4rem'}} variant={"outlined"}
                                                              color={'primary'} onClick={props.onClick}>Add
                                 Tag</Button>}/>
                    <AddNotes user={actor} trigger={(props: any) => <Button variant={"outlined"} color={'secondary'}
                                                                            onClick={props.onClick}>Add
                        Notes</Button>}/>
                </div>

            </div>
        </SingleResultStyles>
    )
};

export default SingleResult
