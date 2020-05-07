import React from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useFilters
} from "react-table";
import matchSorter from "match-sorter";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  TablePagination,
  TextField
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  editable
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return `${initialValue}`;
  }

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

// Default UI For Filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length;

  return (
    <TextField
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

const TagTable = ({ actors }: any) => {
  const { push } = useHistory();
  const [filter, setFilter] = React.useState("" as string | undefined);
  const data = React.useMemo(() => actors, [actors]);
  const columns = React.useMemo(
    () => [
      { Header: "First Name", accessor: "firstName", width: 50 },
      { Header: "Last Name", accessor: "lastName", width: 50 },
      { Header: "Union", accessor: "breakdown.unions" },
      { Header: "Ethnicity", accessor: "breakdown.ethnicity" },
      { Header: "Gender", accessor: "breakdown.gender" },
      { Header: "Vocal Range", accessor: "breakdown.vocalRange" }
    ],
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      Cell: EditableCell
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    setPageSize,
    setGlobalFilter,
    rows
  }: any = useTable<{ pageIndex: number; pageSize: number }>(
    {
      // @ts-ignore
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageSize: 10,
        sortBy: [{ id: "firstName", desc: false }]
      } as any
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );
  return (
    <TableContainer component={Paper}>
      <Table {...getTableProps()} stickyHeader>
        <TableHead>
          {headerGroups.map((headerGroup: any) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} hover>
              {headerGroup.headers.map((column: any) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ width: 100 }}
                >
                  <div>
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ArrowDownwardIcon color={"secondary"} />
                        ) : (
                          <ArrowUpwardIcon color={"secondary"} />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                hover
                role="checkbox"
                tabIndex={-1}
              >
                {row.cells.map((cell: any) => {
                  return (
                    <TableCell
                      {...cell.getCellProps()}
                      onClick={() => push(`/profile/${cell.row.original.id}`)}
                      style={{ width: 100 }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={(e, page) => gotoPage(page)}
        onChangeRowsPerPage={e => setPageSize(Number(e.target.value))}
      />
    </TableContainer>
  );
};

const GET_TAGS_FOR_TAG_PAGE = gql`
  {
    getTagsForTagsPage {
      id
      tag
      for {
        id
        firstName
        lastName
        email
        representation
        city
        state
        gender
        phoneNumber
        website
        eyeColor
        hairColor
        heightInches
        breakdown {
          ageRange
          gender
          unions
          ethnicity
          vocalRange
        }
        profilePicture {
          url
        }
      }
    }
  }
`;
const TagTablePage = (props: any) => {
  const { loading, data } = useQuery(GET_TAGS_FOR_TAG_PAGE);
  const currentTag = props.match.params.tagName;
  if (loading) {
    return <h1>Loading</h1>;
  }
  const actors = data.getTagsForTagsPage
    .filter((tag: any) => tag.tag === currentTag)
    .map((tag: any) => tag.for);
  return (
    <Container>
      <Typography variant="h4">{currentTag}</Typography>
      <Typography variant="body1">Click a Header in Order to Sort</Typography>
      <TagTable actors={actors} />
    </Container>
  );
};

export default TagTablePage;
