# Template zeigen

# JavaScript

1. Vorstellen des Codes

1. ts-check aktivieren
```typescript
//@ts-check
```

# TypeScript

1. Datei kopieren

1. In Index.html target ändern

1. erste typen ergänzen

```typescript
interface WebexMeeting {
        type: 'webex';
        title: string;
        link: string;
        participants: readonly string[];
        from: Date;
        till: Date;
    }


    interface SkypeMeeting {
        type: 'skype';
        title: string;
        link: string;
        participants: readonly { givenName: string, surname: string }[];
        from: Date;
        till: Date;
    }


    interface OnsiteMeeting {
        type: 'onsite';
        title: string;
        room: string;
        participants: readonly string[];
        from: Date;
        till: Date;
    }


    type Meeting = WebexMeeting | SkypeMeeting | OnsiteMeeting;

    const data: readonly Meeting[] = []

    //...

    type MeetingTypes = Meeting['type'];
    type MeetingHelpUrls = Record<Exclude<MeetingTypes, 'onsite'>, string>;
    const helpUrls: MeetingHelpUrls = {};


```

1. Mapping participants

```typescript
    participants: meeting.participants.map(p => `${p.givenName} ${p.surname}`)
```

1. getMeetingLink für Onsite

```typescript
        if (meeting.link == undefined) {
            return undefined;
        }
```

1. `noImplicitAny` aktivieren

```typescript
noImplicitAny: true
```

1. Funktionsparameter ergänzen

1. renderMeetingDetail Fehler beheben

```typescript
if (typeof content === 'string') {
    ddElem.textContent = content;
} else {
    ddElem.appendChild(content);
}
```

1. renderMeetingDetail für HTML Elemente

```typescript
if (typeof content === 'string') {
    ddElem.textContent = content;
} else {
    ddElem.appendChild(content);
}
```

1. renderHelp für onsite
```typescript
        if (meeting.type === 'onsite') {
            return undefined;
        }
```

1. tsconfig strict -> true

```typescript
strict: true
```

1. Element Rendering

```typescript
        let linkElem = getMeetingLink(meeting);
        if (linkElem != undefined) {
            blockElem.appendChild(renderMeetingDetail('Einwahllink:', linkElem));
        }
        if (meeting.room != undefined) {
            blockElem.appendChild(renderMeetingDetail('Raum:', meeting.room));
        }
        blockElem.appendChild(renderMeetingDetail('Teilnehmer:', getMeetingParticipants(meeting)));

        let helpElem = renderHelp(meeting);
        if (helpElem != undefined) {
            blockElem.appendChild(helpElem);
        }
```

1. clearContainer strict

```typescript
function clearContainer(): void {
    const container = document.getElementById('meeting-block-container');
    if (container != undefined) {
        container.innerHTML = '';
    }
}
```

1. append to container strict

```typescript
const container = document.getElementById('meeting-block-container')
if (container != undefined) {
    container.appendChild(element);
}
```


1. helpElem strict

```typescript
const helpElem = renderHelp(meeting);
if (helpElem != undefined) {
    blockElem.appendChild(helpElem);
}
```



1. Teams Typ ergänzen

```typescript

interface TeamsMeeting {
    type: 'teams';
    title: string;
    link: string;
    participants: readonly { name: string }[];
    from: Date;
    till: Date;
}

type Meeting = WebexMeeting | SkypeMeeting | OnsiteMeeting | TeamsMeeting;
```

1. switches ergänzen

```typescript

//helpUrls = 
teams: 'https://www.microsoft.com/de-de/microsoft-teams/group-chat-software',

//getMeetingImageUrl
case 'teams': return 'content/teams.png';

//getMeetingLabel
case 'teams': return 'Microsoft Teams';


```

1. `isNameObject` Type Guard  erstellen und nutzen

```typescript
function isNameObject(obj: unknown): obj is { name: string } {
    return typeof obj === 'object' && typeof (obj as { name?: unknown }).name === 'string';
}

/**/


if (isNameObject(p)) {
    return p.name;
}
```

1. `unsound.ts` erklären