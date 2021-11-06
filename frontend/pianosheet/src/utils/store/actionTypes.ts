import { Action, AnyAction, Store } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type GeneralThunkAction<R, S = object> = ThunkAction<
    R,
    S,
    undefined,
    Action
>;
export type GeneralThunkDispatch = ThunkDispatch<object, undefined, Action>;

export interface ThunkStore<S, A extends Action = AnyAction>
    extends Omit<Store<S, A>, 'dispatch'> {
    dispatch: GeneralThunkDispatch;
}

export type PayloadedAction<P> = AnyAction & { payload: P };

/**
 * Redux behaviour changed by middleware, so overloads here
 *
 * from react-redux-typescript-guide:
 * https://github.com/piotrwitek/react-redux-typescript-guide/blob/master/playground/typings/redux-thunk/index.d.ts
 */
declare module 'redux' {
    /**
     * Overload for bindActionCreators redux function, returns expects responses from thunk actions
     */
    function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
        actionCreators: M,
        dispatch: Dispatch,
    ): {
        [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
            ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
            : M[N];
    };
}
