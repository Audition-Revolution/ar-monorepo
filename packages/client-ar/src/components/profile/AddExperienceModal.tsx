import React, { FC, useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { GlobalContext } from "../../globalContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import { Formik } from "formik";
import { FormikTextField } from "../shared/FormikTextField";
import * as Yup from "yup";
import { GET_EXPERIENCE } from "./ExperienceList";
import {AddItemModalStyles} from "./AddItemModalStyles";

const ADD_EXPERIENCE = require("../../graphql/mutations/profile/ADD_EXPERIENCE.graphql");



const experiences = [
  {
    id: "theatreExperience",
    friendly: "Theatre"
  },
  {
    id: "musicalTheatreExperience",
    friendly: "Musical Theatre"
  },
  {
    id: "operaExperience",
    friendly: "Opera"
  },
  {
    id: "filmExperience",
    friendly: "Film"
  },
  {
    id: "televisionExperience",
    friendly: "Television"
  },
  {
    id: "commercialExperience",
    friendly: "Commercial"
  }
];

const initialValues = {
  role: "",
  project: "",
  company: "",
  director: "",
  description: ""
};

const validationSchema = Yup.object({
  role: Yup.string(),
  project: Yup.string(),
  company: Yup.string(),
  director: Yup.string(),
  description: Yup.string()
});
const AddExperienceModal: FC<any> = () => {
  const [open, toggleOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("theatreExperience");
  const {
    state: { userId }
  } = useContext(GlobalContext);
  const [addExperience] = useMutation(ADD_EXPERIENCE, {
    refetchQueries: [
      {
        query: GET_EXPERIENCE,
        variables: {
          data: {
            userId,
            experienceType: selectedValue
          }
        }
      }
    ]
  });
  const onSubmit = (data: any) => {
    addExperience({
      variables: { data: { experienceType: selectedValue, experience: data } }
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
        Add Experience
      </Button>
      <Dialog
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={() => toggleOpen(false)}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {props => (
            <>
              <DialogTitle>Add An Experience</DialogTitle>
              <DialogContent>
                <AddItemModalStyles name="addExperience">
                  <div>
                    <h3>Choose Experience Type</h3>
                    {experiences.map((experience: any) => (
                      <FormControlLabel
                        control={
                          <Radio
                            checked={selectedValue === experience.id}
                            onChange={() => setSelectedValue(experience.id)}
                            value="general"
                            name="experienceType"
                          />
                        }
                        label={experience.friendly}
                      />
                    ))}
                  </div>
                  <FormikTextField
                    type={"text"}
                    name={"project"}
                    label={"Project Name"}
                  />
                  <FormikTextField
                    type={"text"}
                    name={"role"}
                    label={"Role Name"}
                  />
                  <FormikTextField
                    type={"text"}
                    name={"company"}
                    label={"Company Name"}
                  />
                  <FormikTextField
                    type={"text"}
                    name={"director"}
                    label={"Director"}
                  />
                </AddItemModalStyles>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => toggleOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={props.submitForm} color="primary" autoFocus>
                  Add Experience
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default AddExperienceModal;
