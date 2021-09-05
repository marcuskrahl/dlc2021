# TypeScript


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

1. Help Urls

```typescript
type MeetingTypes = Meeting['type'];
type MeetingHelpUrls = Record<Exclude<MeetingTypes, 'onsite'>, string>;

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