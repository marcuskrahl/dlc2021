module Main exposing (..)

import Browser
import Html exposing (Html, button, div, text, a, span, img)
import Html.Attributes
import Html.Events exposing (onClick)
import Time


type alias WebexMeeting = {
    title: String,
    link: String,
    participants: List String,
    from: Time.Posix,
    till: Time.Posix
    }

type alias SkypeName =  {
    givenName: String,
    surname: String
    }

type alias SkypeMeeting = {
    title: String,
    link: String,
    participants: List SkypeName,
    from: Time.Posix,
    till: Time.Posix
    }


type alias OnsiteMeeting = {
    title: String,
    room: String,
    participants: List String,
    from: Time.Posix,
    till: Time.Posix
    }

type alias NormalizedMeeting = {
    title: String,
    room: Maybe String,
    link: Maybe String,
    participants: List String,
    from: Time.Posix,
    till: Time.Posix,
    label: String,
    helpUrl: Maybe String,
    imageUrl: String
    }

type Meeting = Webex(WebexMeeting) | Skype(SkypeMeeting) | Onsite(OnsiteMeeting)

meetings = [ 
    Webex({
        title = "Standup",
        link = "https://www.example.com",
        participants = ["Max Mustermann", "Inge Beispiel"],
        from = Time.millisToPosix 1631782800000,
        till = Time.millisToPosix 1631783700000
    }),
    Skype({
        title = "Kundentelko",
        link = "https://www.example.com",
        participants = [
            { givenName = "Annett", surname = "Kundin" },
            { givenName = "Inge", surname = "Beispiel" }
        ],
        from = Time.millisToPosix 1631790000000,
        till = Time.millisToPosix 1631793600000
    }),
    Onsite({
        title = "Mitarbeitergespräch",
        room = "F112",
        participants = ["Christin Chefin"],
        from = Time.millisToPosix 1631804400000,
        till = Time.millisToPosix 1631811600000
    })]

helpUrls = {
    webex = "https://www.webex.com/",
    skype = "https://www.skype.com/de/business/"
    }


normalizeMeeting meeting =
    case meeting of  
        Webex(s) -> {
                title = s.title,
                room = Nothing,
                link = Just s.link,
                participants = s.participants,
                label = "WebEx",
                imageUrl = "content/webex.png",
                helpUrl = Just (helpUrls.webex),
                from = s.from,
                till = s.till
                }

        Skype(s) -> {
                title = s.title,
                room = Nothing,
                link = Just s.link,
                participants = List.map (\p -> p.givenName ++ " " ++ p.surname) s.participants,
                label = "Skype for Business",
                imageUrl = "content/skype4business.png",
                helpUrl = Just helpUrls.skype,
                from = s.from,
                till = s.till
                }

        Onsite(s) -> {
                title = s.title,
                room = Just s.room,
                link = Nothing,
                participants = s.participants,
                label = "Vor Ort",
                imageUrl = "content/mms.png",
                helpUrl = Nothing,
                from = s.from,
                till = s.till
                }

getMeetingTime meeting =
        let 
                fromHour = String.padLeft 2 '0' (String.fromInt (Time.toHour Time.utc meeting.from))
                fromMinute = String.padLeft 2 '0' (String.fromInt (Time.toMinute Time.utc meeting.from))
                tillHour = String.padLeft 2 '0' (String.fromInt (Time.toHour Time.utc meeting.till))
                tillMinute = String.padLeft 2 '0' (String.fromInt (Time.toMinute Time.utc meeting.till))
        in 
        fromHour ++ ":" ++ fromMinute ++ " Uhr - " ++ tillHour ++ ":" ++ tillMinute ++ " Uhr"



getMeetingParticipants meeting = 
        String.join ", " meeting.participants

getMeetingLink link =  
    a [Html.Attributes.href link] [text link]

renderMeetingDetail label content = 
    Html.dl [] [
            Html.dt [] [text label]
            , Html.dd [] [content]
    ]

renderHelp href = 
    Html.a 
        [
            Html.Attributes.href href
            ,Html.Attributes.target "_blank"
            ,Html.Attributes.rel "noopener noreferer"
            ,Html.Attributes.class "help-link"
        ] 
        [
            text "?"
        ]

renderMeeting meeting = 
        div [ Html.Attributes.class "meeting-block"] [
                img [ Html.Attributes.src meeting.imageUrl ] []
                , span [ Html.Attributes.class "header" ] [
                        span [] [text (meeting.label ++ ": ")]
                        , span [] [text meeting.title]
                ]
                , renderMeetingDetail "Uhrzeit: " (text (getMeetingTime meeting))
                , case meeting.room of 
                        Just room -> renderMeetingDetail "Raum: " (text room)
                        Nothing -> text ""
                , case meeting.link of 
                        Just link -> renderMeetingDetail "Einwahllink: " (getMeetingLink link)
                        Nothing -> text ""
                , renderMeetingDetail "Teilnehmer: " (text (getMeetingParticipants meeting))
                , case meeting.helpUrl of 
                        Just helpUrl -> renderHelp helpUrl
                        Nothing -> text ""
        ]

main =
  Browser.sandbox { init = 0, update = update, view = view }

type Msg = Increment | Decrement

update msg model = model

view model =
  div [] (List.map (\m -> renderMeeting(normalizeMeeting m))  meetings)

-- build with elm make src/Main.elm --output=script.js