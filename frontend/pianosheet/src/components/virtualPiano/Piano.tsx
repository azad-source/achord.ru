import * as React from 'react';
import CSS from 'csstype';
import styles from './Piano.module.scss';
import cn from 'classnames';

// type ElementParams = {
//     tagName: keyof HTMLElementTagNameMap;
//     className?: string;
//     text?: string;
//     id?: string;
//     href?: string;
//     title?: string;
//     src?: string;
//     data?: {
//         dataType: string;
//         dataValue: string;
//     };
//     style?: string;
//     children?: Nullable<React.ReactNode> | null | undefined | '';
// };

//------- Базовые функции ------------------------------------
// function addElm(params: ElementParams) {
//     const { tagName, className, text, id, href, title, src, data, style, children } = params;

//     const elem = React.createElement(tagName, { className, children,  }, text);

//     let element = document.createElement(tagName);
//     if (classes) element.classList.add(...classes.split(' '));
//     if (text) element.textContent = text;
//     if (id) element.id = id;
//     if (href && element instanceof HTMLLinkElement) element.href = href;
//     if (title) element.title = title;
//     if (src && element instanceof HTMLImageElement) element.src = src;
//     if (data) element.dataset[data.dataType] = data.dataValue;
//     if (style) element.setAttribute('style', style);
//     return <>{element}</>;
// }

// function render(parent: DocumentFragment, child: HTMLElement | JSX.Element) {
//     parent.appendChild(child);
// }
// //------------------------------------------------------------

class PianoKeyboard {
    private wrapper: DocumentFragment;
    private audioArr: { keyVal: string; eventKey: string }[];
    private accords: { name: string; keys: string }[];
    private keyboard: React.ReactNode[];
    private audios: React.ReactNode[];
    private accordElements: React.ReactNode[];
    private chatSocket: WebSocket = new WebSocket(`wss://188.120.244.133:8080/ws/chat/myroom/`);

    constructor() {
        this.wrapper = document.createDocumentFragment();
        this.audioArr = [
            { keyVal: '1_C', eventKey: 'a' },
            { keyVal: '1_Csh', eventKey: 'w' },
            { keyVal: '1_D', eventKey: 's' },
            { keyVal: '1_Dsh', eventKey: 'e' },
            { keyVal: '1_E', eventKey: 'd' },
            { keyVal: '1_F', eventKey: 'f' },
            { keyVal: '1_Fsh', eventKey: 't' },
            { keyVal: '1_G', eventKey: 'g' },
            { keyVal: '1_Gsh', eventKey: 'y' },
            { keyVal: '1_A', eventKey: 'h' },
            { keyVal: '1_Ash', eventKey: 'u' },
            { keyVal: '1_B', eventKey: 'j' },
            { keyVal: '2_C', eventKey: 'k' },
            { keyVal: '2_Csh', eventKey: 'o' },
            { keyVal: '2_D', eventKey: 'l' },
            { keyVal: '2_Dsh', eventKey: 'p' },
            { keyVal: '2_E', eventKey: ';' },
        ];
        this.accords = [
            { name: 'Аккорд С', keys: '1_C 1_E 1_G' },
            { name: 'Аккорд D-moll', keys: '1_D 1_F 1_A' },
            { name: 'Аккорд F', keys: '1_F 1_A 2_C' },
            { name: 'Аккорд G', keys: '1_G 1_B 2_D' },
        ];
        this.keyboard = [];
        this.audios = [];
        this.accordElements = [];
        this.init();
    }

    // keyPressStatus(keyVal: string) {
    //     const keys = this.keyboard.filter((item) => item.dataset.key == keyVal);
    //     if (keys && keys.length > 0) {
    //         keys[0].classList.add('key-element__pressed');
    //         setTimeout(() => {
    //             keys[0].classList.remove('key-element__pressed');
    //         }, 150);
    //     }
    // }

    init() {
        this.chatSocket.onopen = () => {
            console.log('WebSocket connected successfully!');
        };

        this.chatSocket.onmessage = ({ data }) => {
            data = JSON.parse(data);
            // this.keyPressStatus(data.message);
            // this.playNote(data.message);
        };

        return (
            <>
                {this.audioWrapper()}
                {this.keyboardWrapper()}
                {/* {this.initSocket()} */}
                {this.accordPanel()}
                {/* this.initHandlers() */}
            </>
        );
    }

    audioWrapper() {
        return (
            <div className={styles['audio-wrapper']}>
                {this.audioArr.map(({ keyVal }) => {
                    const audio = (
                        <audio
                            src={`/assets/sounds/play_online/piano/${keyVal}.webm`}
                            className={styles['audio']}
                            data-key={keyVal}
                        ></audio>
                    );

                    this.audios.push(audio);

                    return audio;
                })}
            </div>
        );
    }

    sendMes(keyVal?: string) {
        this.chatSocket.send(JSON.stringify({ message: keyVal }));
    }

    keyboardWrapper() {
        let pos = 1;
        const whiteKeys = this.audioArr.filter(({ keyVal }) => !keyVal.includes('sh'));

        const onKeyClick = (e: React.MouseEvent<HTMLDivElement>) => {
            this.sendMes(e.currentTarget.dataset.key);
        };

        document.addEventListener('keypress', (e) => {
            this.audioArr.map(({ keyVal, eventKey }) => {
                if (eventKey == e.key) {
                    this.sendMes(keyVal);
                    return;
                }
            });
        });

        const [keyClass, setKeyClass] = React.useState<string>('');

        return (
            <div className={styles['keyboard-wrapper']}>
                {this.audioArr.map(({ keyVal, eventKey }) => {
                    const isBlack = keyVal.includes('sh');
                    const keyStyles = isBlack
                        ? {
                              width: `${(100 / whiteKeys.length) * 0.8}%`,
                              left: `${(100 / whiteKeys.length) * pos}%`,
                              transform: 'translateX(-50%)',
                              zIndex: 10,
                          }
                        : {};

                    const keyElm = (
                        <div
                            className={cn(
                                styles['key-element'],
                                styles[`key-element__${isBlack ? 'black' : 'white'}`],
                                styles[keyClass],
                            )}
                            data-key={keyVal}
                            style={keyStyles}
                            onClick={onKeyClick}
                            key={keyVal}
                        >
                            {eventKey.toUpperCase()}
                        </div>
                    );

                    this.keyboard.push(keyElm);

                    if (isBlack) {
                        pos =
                            isBlack && (keyVal.includes('Dsh') || keyVal.includes('Ash'))
                                ? pos + 2
                                : pos + 1;
                    }

                    return keyElm;
                })}
            </div>
        );
    }

    // keyPressStatus(keyVal: string) {
    //     const keys = this.keyboard.filter((item) => item.dataset.key == keyVal);
    //     if (keys && keys.length > 0) {
    //         keys[0].classList.add('key-element__pressed');
    //         setTimeout(() => {
    //             keys[0].classList.remove('key-element__pressed');
    //         }, 150);
    //     }
    // }

    // initHandlers() {

    //

    //     this.audios.map((audio) =>
    //         audio.addEventListener('timeupdate', () => {
    //             if (audio.currentTime > audio.duration - 2.5) {
    //                 audio.classList.remove('playing-piano');
    //                 audio.pause();
    //                 audio.currentTime = 0;
    //                 return;
    //             }
    //         }),
    //     );
    // }

    // playNote(key: string) {
    //     const audio = document.querySelector(`audio[data-key="${key}"]`);

    //     if (audio && !audio.classList.contains('playing-piano')) {
    //         //   audio.classList.add("playing-piano");
    //         audio.currentTime = 0;
    //         audio.play();
    //         return;
    //     }
    // }

    accordPanel() {
        return (
            <div className={styles['accord-panel']}>
                {this.accords.map(({ name, keys }) => {
                    const accord = this.accord({ name: name, keys: keys });
                    this.accordElements.push(accord);
                    return accord;
                })}
            </div>
        );
    }

    accord({ name, keys }: { name: string; keys: string }) {
        const onAccordClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.dataset.keys;
            const keys = e.currentTarget.dataset.keys?.split(' ');
            if (keys) keys.map((keyVal) => this.sendMes(keyVal));
        };

        return (
            <button onClick={onAccordClick} className={styles['accord-item']} data-keys={keys}>
                {name}
            </button>
        );
    }
}

// export class Drums {
//     constructor() {
//         this.wrapper = document.createDocumentFragment();
//         this.audioArr = [
//             { keyVal: 'kick', eventKey: '1' },
//             { keyVal: 'kick', eventKey: '2' },
//             { keyVal: 'snare', eventKey: '3' },
//             { keyVal: 'tomfloor', eventKey: '4' },
//             { keyVal: 'tommid', eventKey: '5' },
//             { keyVal: 'tomhi', eventKey: '6' },
//             { keyVal: 'hat_closed', eventKey: '7' },
//             { keyVal: 'hat_open', eventKey: '8' },
//             { keyVal: 'ride', eventKey: '9' },
//             { keyVal: 'crash', eventKey: '0' },
//         ];
//         this.accords = [];
//         this.keyboard = [];
//         this.audios = [];
//         this.accordElements = [];
//         this.init();
//     }

//     init() {
//         this.initAudio();
//         this.initKeyboard();
//         this.initSocket();
//         this.accordPanel();
//         this.initHandlers();
//         return this.wrapper;
//     }

//     initAudio() {
//         const fragment = document.createDocumentFragment();
//         const audioWrapper = addElm({ elm: 'div', classes: 'audioWrapper' });

//         this.audioArr.map(({ keyVal }) => {
//             const audio = addElm({
//                 elm: 'audio',
//                 classes: 'audio',
//                 src: `/assets/sounds/play_online/drums/${keyVal}.webm`,
//                 data: { dataType: 'key', dataValue: keyVal },
//             });

//             this.audios.push(audio);
//             render(audioWrapper, audio);
//         });

//         render(fragment, audioWrapper);
//         render(this.wrapper, fragment);
//     }

//     initKeyboard() {
//         const fragment = document.createDocumentFragment();
//         const drumsWrapper = addElm({ elm: 'div', classes: 'drums-wrapper' });

//         this.audioArr.map(({ keyVal, eventKey }) => {
//             const drumElm = addElm({
//                 elm: 'div',
//                 classes: 'drum-element',
//                 data: { dataType: 'key', dataValue: keyVal },
//                 text: eventKey.toUpperCase(),
//             });
//             this.keyboard.push(drumElm);
//             render(drumsWrapper, drumElm);
//         });

//         render(fragment, drumsWrapper);
//         render(this.wrapper, fragment);
//     }

//     initSocket() {
//         this.chatSocket = new WebSocket(
//             `wss://188.120.244.133:8080/ws/chat/myroom/`,
//         );

//         this.chatSocket.onopen = () => {
//             console.log('WebSocket connected successfully!');
//         };

//         this.chatSocket.onmessage = ({ data }) => {
//             data = JSON.parse(data);
//             this.keyPressStatus(data.message);
//             this.playDrum(data.message);
//         };
//     }

//     keyPressStatus(keyVal) {
//         const keys = this.keyboard.filter((item) => item.dataset.key == keyVal);
//         if (keys && keys.length > 0) {
//             keys[0].classList.add('drum-element__pressed');
//             setTimeout(() => {
//                 keys[0].classList.remove('drum-element__pressed');
//             }, 150);
//         }
//     }

//     initHandlers() {
//         this.keyboard.map((key) =>
//             key.addEventListener('click', (e) =>
//                 this.sendMes(e.target.dataset.key),
//             ),
//         );

//         document.addEventListener('keypress', (e) => {
//             this.audioArr.map(({ keyVal, eventKey }) => {
//                 if (eventKey == e.key) {
//                     this.sendMes(keyVal);
//                     return;
//                 }
//             });
//         });

//         this.accordElements.map((accord) => {
//             accord.addEventListener('click', (e) => {
//                 const keys = e.target.dataset.keys.split(' ');
//                 keys.map((keyVal) => this.sendMes(keyVal));
//             });
//         });
//     }

//     sendMes(keyVal) {
//         this.chatSocket.send(JSON.stringify({ message: keyVal }));
//     }

//     playDrum(key) {
//         // const audio = document.querySelector(`audio[data-key="${key}"]`);
//         // audio.classList.add("playing");
//         // audio.currentTime = 0;
//         // audio.play();
//     }

//     accordPanel() {
//         const fragment = document.createDocumentFragment();
//         const accrodPanel = addElm({ elm: 'div', classes: 'accord-panel' });

//         this.accords.map(({ name, keys }) => {
//             const accord = this.accord({ name: name, keys: keys });
//             this.accordElements.push(accord);
//             render(accrodPanel, accord);
//         });

//         render(fragment, accrodPanel);
//         render(this.wrapper, fragment);
//     }

//     accord({ name, keys }) {
//         const accord = addElm({
//             elm: 'button',
//             text: name,
//             classes: 'accord-item',
//             data: {
//                 dataType: 'keys',
//                 dataValue: keys,
//             },
//         });
//         return accord;
//     }
// }

// //_________________________________________________________________
// // Создаем экземпляр пианино (в dom не рендерим)
// const piano = new PianoKeyboard();

// // Создаем экземпляр ударных (в dom не рендерим)
// const drums = new Drums();

// // Создаем экземпляр обертки табов
// const tabs = new Tabs('#root');

// // Добавляем вкладки с указанием названия, id и контента
// tabs.createTab('Drums', 'drums', drums);
// tabs.createTab('Piano', 'piano', piano);
// tabs.createTab('Guitar', 'guitar');

// // Здесь пример длительного воспроизведения звука:
// // https://stackoverflow.com/questions/7330023/gapless-looping-audio-html5/22446616#22446616

export const Piano = () => {
    const virPiano = new PianoKeyboard();

    return <div>{virPiano.init()}</div>;
};
