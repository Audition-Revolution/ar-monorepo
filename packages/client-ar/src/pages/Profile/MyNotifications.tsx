import gql from "graphql-tag";

// const useStyles = makeStyles(() => ({
//   root: {
//     height: "80%"
//   }
// }));

const MyNotifications = () => {
  // const { userId } = useContext(GlobalContext);
  // const classes = useStyles();
  // const { loading, data } = useQuery(GET_NOTIFICATIONS(), {
  //   variables: { id: userId },
  //   skip: !userId
  // });
  //
  // const [readNotification] = useMutation(READ_NOTIFICATION(), {
  //   refetchQueries: [
  //     {
  //       query: GET_NOTIFICATIONS(),
  //       variables: { id: userId }
  //     }
  //   ]
  // });
  // if (loading) {
  //   return <h1>Loading</h1>;
  // }
  // const markRead = (notification: any) => {
  //   if (!notification.read) {
  //     readNotification({ variables: { id: notification.id } });
  //   }
  // };
  // const user = data && data.getNotifications;

  return null
  // if (!user) {
  //   return null;
  // }
  //
  // return (
  //   <Container className="h-full">
  //     <Paper className={clsx(classes.root, "p-16 mt-36")}>
  //       <Typography variant="h4">My Notifications</Typography>
  //       <List>
  //         {user.notifications.map((notification: any) => {
  //           return (
  //             <>
  //               <ListItem alignItems="flex-start">
  //                 {!notification.read && (
  //                   <ListItemIcon>
  //                     <MarkunreadIcon />
  //                   </ListItemIcon>
  //                 )}
  //                 <ListItemText
  //                   inset={notification.read}
  //                   key={notification.id}
  //                   primary={
  //                     <div
  //                       className="flex justify-between"
  //                       onMouseEnter={() => markRead(notification)}
  //                     >
  //                       <Link to={notification.linkTo}>
  //                         <Typography variant="h6">
  //                           {notification.text}
  //                         </Typography>
  //                       </Link>
  //                     </div>
  //                   }
  //                 />
  //               </ListItem>
  //               <Divider />
  //             </>
  //           );
  //         })}
  //       </List>
  //     </Paper>
  //   </Container>
  // );
};

export default MyNotifications;

export const READ_NOTIFICATION = () => gql`
  mutation readNotification($id: String!) {
    readNotification(id: $id)
  }
`;

export const GET_NOTIFICATIONS = () => gql`
  query getNotifications($id: String!) {
    getNotifications(id: $id) {
      id
      displayName
    }
  }
`;
