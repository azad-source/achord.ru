import * as React from 'react';

/**
 * Заворачивает первый экспортируемый член модуля в дефолтный. Позволяет
 * слегка сократить динамический импорт реактовых контролов.
 *
 * @example
 * const LazyMainPage = React.lazy(() =>
 *      getFirstAsDefault(import('components/app/main/MainPage/MainPage')),
 * );
 *
 * вместо
 * const LazyMainPage = React.lazy(() =>
 *      import('components/app/main/MainPage/MainPage').then(({ MainPage }) => ({
 *          default: MainPage,
 *      })),
 * );
 * @param asyncModule
 */
export function getFirstAsDefault(
    asyncModule: Promise<any>,
): Promise<{ default: React.ComponentType<any> }> {
    return asyncModule.then((sub) => {
        const first = Object.keys(sub)[0];
        return { default: sub[first] as React.ComponentType<any> };
    });
}
