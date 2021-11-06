import * as React from 'react';
import styles from './PlayOnlinePage.module.scss';
import cn from 'classnames';
import piano_1_C from 'audio/key08.ogg';
import piano_1_Csh from 'audio/key09.ogg';
import piano_1_D from 'audio/key10.ogg';
import piano_1_Dsh from 'audio/key11.ogg';
import piano_1_E from 'audio/key12.ogg';
import piano_1_F from 'audio/key13.ogg';
import piano_1_Fsh from 'audio/key14.ogg';
import piano_1_G from 'audio/key15.ogg';
import piano_1_Gsh from 'audio/key16.ogg';
import piano_1_A from 'audio/key17.ogg';
import piano_1_Ash from 'audio/key18.ogg';
import piano_1_B from 'audio/key19.ogg';
import piano_2_C from 'audio/key20.ogg';
import piano_2_Csh from 'audio/key21.ogg';
import piano_2_D from 'audio/key22.ogg';
import piano_2_Dsh from 'audio/key23.ogg';
import piano_2_E from 'audio/key24.ogg';

export const PlayOnlinePage: React.FC = () => {
    return (
        <div className={styles.root}>
            <Piano />
        </div>
    );
};

const Piano = () => {
    type keyType = {
        audio: string;
        pressed: boolean;
        eventKey: string;
        isBlack?: boolean;
    };

    const [pianoKeys, setPianoKeys] = React.useState<Record<string, keyType>>({
        '1_C': { audio: piano_1_C, pressed: false, eventKey: 'a' },
        '1_Csh': { audio: piano_1_Csh, pressed: false, eventKey: 'w' },
        '1_D': { audio: piano_1_D, pressed: false, eventKey: 's' },
        '1_Dsh': { audio: piano_1_Dsh, pressed: false, eventKey: 'e' },
        '1_E': { audio: piano_1_E, pressed: false, eventKey: 'd' },
        '1_F': { audio: piano_1_F, pressed: false, eventKey: 'f' },
        '1_Fsh': { audio: piano_1_Fsh, pressed: false, eventKey: 't' },
        '1_G': { audio: piano_1_G, pressed: false, eventKey: 'g' },
        '1_Gsh': { audio: piano_1_Gsh, pressed: false, eventKey: 'y' },
        '1_A': { audio: piano_1_A, pressed: false, eventKey: 'h' },
        '1_Ash': { audio: piano_1_Ash, pressed: false, eventKey: 'u' },
        '1_B': { audio: piano_1_B, pressed: false, eventKey: 'j' },
        '2_C': { audio: piano_2_C, pressed: false, eventKey: 'k' },
        '2_Csh': { audio: piano_2_Csh, pressed: false, eventKey: 'o' },
        '2_D': { audio: piano_2_D, pressed: false, eventKey: 'l' },
        '2_Dsh': { audio: piano_2_Dsh, pressed: false, eventKey: 'p' },
        '2_E': { audio: piano_2_E, pressed: false, eventKey: ';' },
    });

    const isBlackKey = (key: string): boolean => key.includes('sh');
    const whiteKeysCount = Object.keys(pianoKeys).filter((key) => !isBlackKey(key)).length;
    let blackPos: number = 0;

    return (
        <div className={styles['keyboard-wrapper']}>
            {Object.keys(pianoKeys).map((key, index) => {
                const { eventKey, audio } = pianoKeys[key];
                const isBlack = isBlackKey(key);

                if (isBlack && (key.includes('Csh') || key.includes('Fsh'))) blackPos++;

                return (
                    <PianoKey
                        key={key}
                        pos={isBlack ? blackPos++ : index}
                        eventKey={eventKey}
                        audio={audio}
                        isBlack={isBlack}
                        whiteKeysCount={whiteKeysCount}
                        keyVal={key}
                    />
                );
            })}
        </div>
    );
};

interface PianoKeyProps {
    eventKey: string;
    pos: number;
    keyVal: string;
    audio: string;
    isBlack?: boolean;
    whiteKeysCount: number;
}

const PianoKey: React.FC<PianoKeyProps> = ({
    eventKey,
    pos,
    keyVal,
    audio,
    isBlack,
    whiteKeysCount,
}) => {
    let pressed = false;

    let aCtx: AudioContext = new AudioContext();
    let source: AudioBufferSourceNode = aCtx.createBufferSource();
    let buf: AudioBuffer;
    React.useEffect(() => {
        fetch(audio) // can be XHR as well
            .then((resp) => resp.arrayBuffer())
            .then((buf) => aCtx.decodeAudioData(buf)) // can be callback as well
            .then((decoded: AudioBuffer) => {
                source.buffer = buf = decoded;
                source.loop = true;
                source.connect(aCtx.destination);
            });
    });

    const playOn = () => {
        try {
            source.start(0);
        } catch (error) {}
    };

    const playOff = () => {
        try {
            source.stop(0); // this destroys the buffer source
            source = aCtx.createBufferSource(); // so we need to create a new one
            source.buffer = buf;
            source.loop = true;
            source.connect(aCtx.destination);
        } catch (error) {}
    };

    document.addEventListener('keydown', (e) => {
        if (eventKey == e.key) playOn();
    });

    document.addEventListener('keyup', (e) => {
        if (eventKey == e.key) playOff();
    });

    const keyStyles = isBlack
        ? {
              width: `${(100 / whiteKeysCount) * 0.8}%`,
              left: `${(100 / whiteKeysCount) * pos}%`,
              transform: 'translateX(-50%)',
              zIndex: 10,
          }
        : {};

    return (
        <div
            className={cn(
                styles['key-element'],
                styles[`key-element_${isBlack ? 'black' : 'white'}`],
                pressed && styles['key-element_pressed'],
            )}
            onMouseDown={playOn}
            onMouseUp={playOff}
            style={keyStyles}
        >
            {eventKey.toUpperCase()}
        </div>
    );
};
