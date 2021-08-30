import User from "common/src/Models/User";
import firebase from "firebase";
import { makeAutoObservable } from "mobx";
import React from "react";
import { Socket } from "socket.io-client";

export class AuthViewModel
{
    public readonly authProvider: firebase.auth.Auth;
    public readonly analyticsProvider: firebase.analytics.Analytics;
    public readonly storeProvider: firebase.firestore.Firestore;
    public readonly storageProvider: firebase.storage.Storage;

    public user = new User( "", "" );

    public socket: Socket | undefined;

    constructor()
    {
        firebase.initializeApp( {
            apiKey: "AIzaSyD8k9-v0Fa0KXLwOKUQ9ABXzFKSSmLdwJk",
            authDomain: "bratiano-v1.firebaseapp.com",
            projectId: "bratiano-v1",
            storageBucket: "bratiano-v1.appspot.com",
            messagingSenderId: "170820753459",
            appId: "1:170820753459:web:47fb38c66e5307d9ae6b46",
            measurementId: "G-VCTJRZVMES"
        } );
        this.authProvider = firebase.auth();
        this.analyticsProvider = firebase.analytics();
        this.storeProvider = firebase.firestore();
        this.storageProvider = firebase.storage();
        this.authProvider.onAuthStateChanged( async user =>
        {
            if ( user !== undefined && user !== null )
            {
                this.updateUserData( user );
                this.analyticsProvider.logEvent( "user_login" );
                this.storeProvider.collection( "users" ).doc( user.uid ).set( {
                    name: user.displayName,
                    uid: user.uid,
                } );
                console.log( await user.getIdToken( true ) );
                // this.socket = io( "https://bratiano.herokuapp.com/", {
                //     // this.socket = io( "http://192.168.0.106:5000", {
                //     auth: {
                //         token: await user.getIdToken()
                //     }
                // } );
            }
        } );
        makeAutoObservable( this.user );
    }

    private updateUserData( firebaseUser: firebase.User )
    {
        this.user.displayName = firebaseUser.displayName ?? "";
        this.user.email = firebaseUser.email ?? "";
    }

    public async login( email: string, password: string )
    {
        await this.authProvider.signInWithEmailAndPassword( email, password );
    }

    public async register( email: string, password: string, username: string )
    {
        const response = await this.authProvider.createUserWithEmailAndPassword( email, password );
        await response.user?.updateProfile( { displayName: username } );
        if ( response.user )
        {
            this.updateUserData( response.user );
        }
        this.analyticsProvider.logEvent( "user_register" );
    }

    public async loginAnonymously()
    {
        await this.authProvider.signInAnonymously();
    }

    public async logout()
    {
        await this.authProvider.signOut();
        this.analyticsProvider.logEvent( "user_logout" );
    }

    public async updateDisplayName( displayName: string )
    {
        await this.authProvider.currentUser?.updateProfile( { displayName: displayName } );
        if ( this.user )
        {
            this.user.displayName = displayName;
        }
    }
}

const AuthContext = React.createContext<AuthViewModel>( {} as AuthViewModel );

export default AuthContext;