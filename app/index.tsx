// Web: 927487391112-9hrko7h8qcp0pagk2n1dcih07skdgeus.apps.googleusercontent.com
// Ios: 927487391112-jru70jjdln91rgf72amitif190t70b0p.apps.googleusercontent.com
// Android: 927487391112-hm2jsc5u38rfc6kes0u6kgvhptlge50c.apps.googleusercontent.com
import { View, Text, Button, Pressable } from 'react-native'
import * as React from 'react'
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const index = () => {
    const [userInfo, setUserInfo] = React.useState(null);
    const [request,response,promptAsync] = Google.useAuthRequest({
        androidClientId:"927487391112-hm2jsc5u38rfc6kes0u6kgvhptlge50c.apps.googleusercontent.com",
        iosClientId:"927487391112-jru70jjdln91rgf72amitif190t70b0p.apps.googleusercontent.com",
        webClientId:"927487391112-9hrko7h8qcp0pagk2n1dcih07skdgeus.apps.googleusercontent.com",
    });

    React.useEffect(()=>{
        handleSignInWithGoogle();
    },[response])

    const handleSignInWithGoogle = async () => {
        const user = await AsyncStorage.getItem("@user");
        if(!user){
            if(response?.type === "success"){
                await getUserInfo(response.authentication?.accessToken);
            }
        }else{
            setUserInfo(JSON.parse(user));
        }
    }

    const getUserInfo = async (token:any) =>{
        if(!token) return;
        try{
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const user = await response.json();
            await AsyncStorage.setItem("@user",JSON.stringify(user));
            setUserInfo(user);
        }
        catch(e){
            console.log(e)
        }
    }
  return (
    <View>
        <Text>{JSON.stringify(userInfo,null,2)}</Text>
      <Text>GoogleAuth</Text>
      <Button title='Sign in With Google' onPress={()=>promptAsync()} />
      <Button title='Delete local storage' onPress={()=>AsyncStorage.removeItem("@user")} />
    </View>
  )
}

export default index