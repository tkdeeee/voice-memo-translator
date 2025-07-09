// export const UPDATE_DISPLAYNAME = "UPDATE_DISPLAYNAME";
// export const UPDATE_PHOTOURL = "UPDATE_PHOTOURL";
// export const FETCH_SELF_PROFILE = "FETCH_SELF_PROFILE";

// export type userBasicInfotype = {
//     uid: string,
//     displayName: string,
//     photoURL: string,
//     email: string
// }

// export const updateDisplayName = (newDisplayname: string) => {
//     return {
//         type: UPDATE_DISPLAYNAME,
//         payload: newDisplayname
//     };
// };

// export const updatePhotoURL = (newPhotoURL: string) => {
//     return {
//         type: UPDATE_PHOTOURL,
//         payload: newPhotoURL,
//     };
// };

// export const fetchSelfProfile = (user: userBasicInfotype) => {
//     return {   
//         type: FETCH_SELF_PROFILE,
//         payload: user,
//     };
// };

// export type UserAction =
//     | ReturnType<typeof updateDisplayName>
//     | ReturnType<typeof updatePhotoURL>
//     | ReturnType<typeof fetchSelfProfile>