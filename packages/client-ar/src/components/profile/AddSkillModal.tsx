import React, { FC, useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { GlobalContext } from "../../globalContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { Formik } from "formik";
import { FormikTextField } from "../shared/FormikTextField";
import * as Yup from "yup";
import {AddItemModalStyles} from "./AddItemModalStyles";
import {ADD_SKILL} from "../../graphql/AddSkillOrTraining";

const GET_USER = require("../../graphql/queries/user/GET_USER.graphql");

const initialValues = {
  text: ""
};

const validationSchema = Yup.object({
  text: Yup.string()
});

const AddSkillModal: FC<any> = props => {
  const [open, toggleOpen] = useState(false);
  const { state: {userId} } = useContext(GlobalContext);
  const [addSkill] = useMutation(ADD_SKILL, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { id: userId }
      }
    ]
  });
  const onSubmit = (data: any) => {
    addSkill({
      variables: {
        type: props.type,
        text: data.text
      }
    });
    toggleOpen(false);
  };
  return (
    <>
      <Button
        onClick={() => toggleOpen(true)}
        variant={"contained"}
        color="primary"
      >
        {props.type === "skill" ? "Add Skill" : "Add Training"}
      </Button>
      <Dialog
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        fullWidth={true}
        open={open}
        onClose={() => toggleOpen(false)}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {fProps => (
            <>
              <DialogTitle>
                {props.type === "skill"
                  ? "Add A Special Skill"
                  : "Add Training"}
              </DialogTitle>
              <DialogContent>
                <AddItemModalStyles name="addSkill">
                  <FormikTextField type={"text"} name={"text"} label={"Text"} />
                </AddItemModalStyles>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => toggleOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={fProps.submitForm} color="primary" autoFocus>
                  {props.type === "skill" ? "Add Skill" : "Add Training"}
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default AddSkillModal;
