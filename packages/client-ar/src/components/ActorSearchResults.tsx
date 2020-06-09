import React, {useState} from "react";
import {
    Divider,
    Paper,
    Typography
} from "@material-ui/core";
import Pagination from "./shared/Pagination";
import SingleResult from "./SingleResult";
import styled from "styled-components";

const ActorSearchStyles = styled(Paper)`
    width: 100%;
    min-height: 60vh;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .title {
        display:flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.6rem;
        height: 6.4rem;
        .found {
            font-size: 1.6rem;
        }
        .number {
            font-size: 1.1rem;
            font-weight: 500;
            border-radius: 4px;
            color: white;
            background: blue;
            padding: .4rem .8rem;
        }
    }
    
    .result-container {
        width: 100%;
        min-width: 100%;
        display: flex;
        flex-grow: 1; 
    }
`

function ActorSearchResults(props: any) {
    const [selected, setSelectedPage] = useState(0);
    const changePage = (data: any) => setSelectedPage(data.selected);
    const sliceToShow =
        props.actors && props.actors.slice(selected * 10, selected * 10 + 10);
    return (
        <ActorSearchStyles>
            <div className="title">
                <Typography className="found">Found Actors</Typography>
                <Typography className="number">
                    {props.actors.length + " Actors"}
                </Typography>
            </div>
            <div className="result-container">
                <div style={{width: '100%'}}>
                    {sliceToShow.map((actor: any) => (
                        <>
                            <SingleResult actor={actor} handleClickTalent={props.handleClickTalent}
                                          includeEmail={props.includeEmail}/>
                            <Divider/>
                        </>
                    ))}
                </div>
            </div>
            <Pagination
                itemCount={props.actors.length}
                handlePageChange={changePage}
            />
        </ActorSearchStyles>
    );
}

export default React.memo(ActorSearchResults);
