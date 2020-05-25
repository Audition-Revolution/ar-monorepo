import React, {FC, useState} from "react";
import {createStyles, ListItem, ListItemText, makeStyles, Modal, Theme} from "@material-ui/core";
import TalentSpecificationsForm from "../shared/TalentSpecificationsForm";
import {useHistory} from "react-router-dom";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}
const ListItemLink = (props: any) => {
    const history = useHistory();
    return <ListItem onClick={() => history.push(props.to)} {...props} />;
};

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        paper: {
            position: "absolute",
            width: 800,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3)
        },
        text: {
            color: theme.palette.secondary.light
        }
    });
});

export const AttributesModal: FC<any> = props => {
    const classes = useStyles();
    const [open, changeOpen] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const handleSubmit = async () => {
        await props.addUserBreakdown(props.specs);
        changeOpen(false);
        window.location.reload();
    };

    return (
        <>
            <ListItemLink onClick={() => changeOpen(true)}>
                <ListItemText
                    classes={{secondary: classes.text}}
                    primary="Actor Breakdown"
                    secondary="Update Your Character Types"
                />
            </ListItemLink>
            <Modal onClose={() => changeOpen(false)} open={open}>
                <div style={modalStyle} className={classes.paper}>
                    <h1>Actor Attributes</h1>
                    <TalentSpecificationsForm
                        onSubmit={handleSubmit}
                        button={true}
                        breakdown={props.user.breakdown}
                    />
                </div>
            </Modal>
        </>
    );
};
