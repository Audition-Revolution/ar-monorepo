import React, {FC, Suspense} from "react";
import {Route, Switch} from "react-router-dom";
import {PrivateRoute, RedirectIfLoggedIn} from "./utils/RouterUtils";

const ProfilePage = React.lazy(() => import("./pages/Profile/ProfilePage"));
const RegistrationPage = React.lazy(() => import("./pages/Auth/RegistrationPage"));
const ActorSearchPage = React.lazy(() => import("./pages/Search/ActorSearchPage"));
const PasswordResetPage = React.lazy(() => import("./pages/Auth/PasswordResetPage"));
const SettingsPage = React.lazy(() => import("./pages/General/SettingsPage"));
const AuditionSearchPage = React.lazy(() => import("./pages/Search/AuditionSearchPage"));
const MyAuditions = React.lazy(() => import("./pages/Profile/MyAuditions"));
const LoginPage = React.lazy(() => import("./pages/Auth/LogInPage"));
const MyAuditionInstance = React.lazy(() => import("./pages/Profile/MyAuditionInstance"));
const MyNotifications = React.lazy(() => import("./pages/Profile/MyNotifications"));
const MyTags = React.lazy(() => import("./pages/Profile/MyTags"));
const CompanyRegistrationPage = React.lazy(() => import("./pages/Auth/CompanyRegistrationPage"));
const PendingPasswordResetPage = React.lazy(() => import("./pages/Auth/PendingPasswordResetPage"));
const TagTablePage = React.lazy(() => import("./pages/Company/TagTablePage"));

const AppRouter: FC<any> = () => {
    return (
        <Suspense fallback={<span/>}>
            <Switch>
                <Route exact path="/passwordReset" component={PasswordResetPage}/>
                <Route exact path="/pendingPasswordReset" component={PendingPasswordResetPage}/>
                <Route path="/passwordReset/:token" component={PasswordResetPage}/>

                {/* Login Related */}
                <RedirectIfLoggedIn
                    exact
                    path="/register"
                    component={RegistrationPage}
                />
                <RedirectIfLoggedIn
                    exact
                    path="/register-company"
                    component={CompanyRegistrationPage}
                />
                <RedirectIfLoggedIn
                    exact
                    path="/login"
                    component={LoginPage}
                />


                {/* Company Related */}
                <PrivateRoute
                    path="/tag/:tagName"
                    component={TagTablePage}
                />

                <PrivateRoute
                    exact
                    path="/settings"
                    component={SettingsPage}
                />

                {/* Search */}
                <PrivateRoute
                    exact
                    path="/search/actor"
                    component={ActorSearchPage}
                />
                <PrivateRoute
                    exact
                    path="/search/audition"
                    component={AuditionSearchPage}
                />

                {/* User */}
                <PrivateRoute
                    exact
                    path="/profile/auditions"
                    component={MyAuditions}
                />
                <PrivateRoute
                    exact
                    path="/profile/notifications"
                    component={MyNotifications}
                />
                <PrivateRoute
                    exact
                    path="/profile/tags"
                    component={MyTags}
                />
                <PrivateRoute
                    exact
                    path="/profile/auditions/:instanceId"
                    component={MyAuditionInstance}
                />
                <PrivateRoute
                    exact
                    path="/profile/images"
                    component={(props: any) => <ProfilePage tabIndex={2} {...props} />}
                />
                <PrivateRoute
                    exact
                    path="/profile/:userId/images"
                    component={(props: any) => (
                        <ProfilePage
                            readOnly={true}
                            user={props.match.params.userId}
                            tabIndex={2}
                            {...props}
                        />
                    )}
                />
                <PrivateRoute
                    exact
                    path="/profile"
                    component={ProfilePage}
                />
                <PrivateRoute
                    exact
                    path="/profile/:userId"
                    component={(props: any) => <ProfilePage readOnly={true} {...props} />}
                />
                <PrivateRoute
                    path="/"
                    component={ProfilePage}
                />
            </Switch>
        </Suspense>
    );
};

export default AppRouter;
