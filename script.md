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

    const helpUrls: Record<string, string> = {};


```

1. `noImplicitAny` aktivieren

```typescript
noImplicitAny: true
```

1. Funktionsparameter ergänzen

1. Fehler in getMeetingParticipants beheben

```typescript
  function getMeetingParticipants(meeting) {
        return meeting.participants.map(p => {
            if (typeof p === 'string') {
                return p;
            }
            return `${p.givenName} ${p.surname}`;
        }).join(', ');
    }
```

1. renderMeeting Fehler bei Room beheben

```typescript
if (meeting.type === 'onsite') {
    blockElem.appendChild(renderMeetingDetail('Raum:', meeting.room));
} else {
    blockElem.appendChild(renderMeetingDetail('Einwahllink:', getMeetingLink(meeting)));
}
```

1. renderMeetingDetail Fehler beheben

```typescript
if (typeof content === 'string') {
    ddElem.textContent = content;
} else {
    ddElem.appendChild(content);
}
```

1. `noImplicitReturns` aktivieren

```typescript
"noImplicitReturns": false,
```

1. Return types ergänzen

1. tsconfig strict -> true

```typescript
strict: true
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


1. Help Urls

```typescript
type MeetingTypes = Meeting['type'];
type MeetingHelpUrls = Record<Exclude<MeetingTypes, 'onsite'>, string>;

```

1. helpUrls POJO
```
 const helpUrls: MeetingHelpUrls = {
    webex: 'https://www.webex.com/',
    skype: 'https://www.skype.com/de/business/'
}
```

1. helpElem strict

```typescript
const helpElem = renderHelp(meeting);
if (helpElem != undefined) {
    blockElem.appendChild(helpElem);
}
```


1. Unsupported Value Error
```typescript
default: throw new UnsupportedValueError(type);


class UnsupportedValueError extends Error {
    constructor(value: never) {
        super(`This value is not supported: ${value}`)
    }
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