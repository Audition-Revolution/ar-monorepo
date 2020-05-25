import React, {FC, useContext} from "react";
import {connect} from "react-redux";
import {getFormState} from "../../redux/store/reducers/finalFormReducer";
import {addUserBreakdown} from "../../redux/actions/talentActions";
import {Chip, List} from "@material-ui/core";
import {GlobalContext} from "globalContext";
import EditUserModal from "./EditUserModal";
import AddTags from "./AddTags";
import AddNotes from "./AddNotes";
import {AttributesModal} from "./AttributesModal";

const ProfileSidebar: FC<any> = (props: any) => {
    const { state: {userType}} = useContext(GlobalContext);
    const canAddNotes = userType.includes("theatre");

    return (
        <div>
            {props.readOnly ? (props.user.ghostAccount ? (
                <Chip
                    style={{marginLeft: '16px'}}
                    color={"primary"}
                    label="Unverified Account"
                />
            ) : (
                <Chip
                    style={{marginLeft: '16px'}}
                    color={"primary"}
                    label="Verified Account"
                />
            )) : null}
            <List component="nav" aria-label="">
                {!props.readOnly && <AttributesModal {...props} />}
                {!props.readOnly && <EditUserModal user={props.user}/>}
                {props.readOnly && canAddNotes && !props.auditionView && <AddNotes user={props.user}/>}
                {props.readOnly && !props.auditionView && <AddTags user={props.user}/>}
            </List>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        specs: getFormState(state, "talentSpecs").values
    };
};

export default connect(mapStateToProps, {addUserBreakdown})(ProfileSidebar);
