import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/react-hooks";
import {Container, List, makeStyles, Paper, Typography} from "@material-ui/core";
import TagSection from "./TagSection";
import {GET_TAGS_FOR_OWNER} from "../../graphql/Tags";

const useStyles = makeStyles(() => ({
    root: {
        minHeight: "80%",
        padding: '1.6rem',
        marginTop: '3.6rem'
    }
}));
const MyTags = () => {
    const [tags, setTags] = useState({} as any);
    const classes = useStyles();
    const {loading, data} = useQuery(GET_TAGS_FOR_OWNER);
    const fetchedTags = data?.getTagsForOwner;
    useEffect(() => {
        if (data?.getTagsForOwner) {
            const tagsObject = fetchedTags.reduce((acc: any, val: any) => {
                if (acc[val.tag]) {
                    acc[val.tag].push(val.for);
                } else {
                    acc[val.tag] = [val.for];
                }
                return acc;
            }, {});
            setTags(tagsObject);
        }
    }, [data, fetchedTags]);
    if (loading) {
        return <h1>Loading</h1>;
    }
    const tal = tags["My Talent"] ? [...tags["My Talent"]] : [];
    delete tags["My Talent"];
    return (
        <Container style={{height: '100%'}}>
            <Paper className={classes.root}>
                <Typography variant="h5">My Tags</Typography>
                <List>
                    <TagSection tagName={"My Talent"} users={tal}/>
                    {Object.entries(tags).map(([tagName, users]: [any, any]) => {
                        return <TagSection key={tagName} tagName={tagName} users={users}/>;
                    })}
                </List>
            </Paper>
        </Container>
    );
};
export default MyTags;
