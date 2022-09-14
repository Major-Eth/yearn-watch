import React, {ReactElement, useEffect, useState} from 'react';
import {useWatch} from 'contexts/useWatch';
import {TAlertLevels, TStrategy, TVault} from 'contexts/useWatch.d';
import {Banner, Card, SearchBox, Switch} from '@yearn-finance/web-lib/components';
import {AlertSelector} from 'components/AlertSelector';
import SectionAlertList from 'components/sections/alerts/SectionAlertList';
import {findStrategyBySearch, findVaultBySearch} from 'utils/filters';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Alerts page
******************************************************************************/
function	Alerts(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = useState([] as (TStrategy | TVault)[]);
	const	[searchTerm, set_searchTerm] = useState('');
	const	[shouldDisplayDismissed, set_shouldDisplayDismissed] = useState(false);
	const	[alertFilter, set_alertFilter] = useState<TAlertLevels>('none');

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** If shouldDisplayDismissed is false then only the strategies that are not
	** dismissed are displayed.
	**************************************************************************/
	useEffect((): void => {
		const	_vaults = vaults;
		const	_filteredVaults = [..._vaults];
		const	_filteredStrategies = [];

		for (const vault of _filteredVaults) {
			if ((vault?.alerts || []).length > 0) {
				if (findVaultBySearch(vault, searchTerm)) {
					if (alertFilter === 'none' || vault.alerts.some((alert): boolean => alert.level === alertFilter))
						_filteredStrategies.push(vault);
				}
			}
			for (const strategy of vault.strategies) {
				if ((strategy?.alerts || []).length > 0) {
					if (findStrategyBySearch(strategy, searchTerm)) {
						if (alertFilter === 'none' || strategy?.alerts.some((alert): boolean => alert.level === alertFilter))
							_filteredStrategies.push(strategy);
					}
				}
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, shouldDisplayDismissed, alertFilter]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<div className={'mb-4'}>
				<Banner title={'Alerts'}>
					<div>
						<p>{'The alert section is used to hightlight some potential issues. Issues are splitted in 3 categories: warning, error and critical. Alerts can be on the vault level or on the strategy level.'}</p>
						<p className={'mt-4 block'}>{'You can dismiss non-revelant alerts safely, they will no longer be displayed in your browser unless some new alerts are triggered on this same element.'}</p>
					</div>
				</Banner>
			</div>
			<div className={'flex-col-full space-y-5'}>
				<div className={'flex flex-col-reverse items-start space-x-0 md:flex-row md:space-x-4'}>
					<div className={'mt-2 flex w-full flex-col space-y-2 md:mt-0'}>
						<SearchBox
							searchTerm={searchTerm}
							onChange={set_searchTerm} />
						<div className={'flex-row-center'}>
							<p className={'text-xs text-neutral-500'}>{`Search result: ${filteredStrategies.length}`}</p>
						</div>
					</div>
					<div className={'flex flex-row items-center justify-between space-x-2 md:justify-start md:space-x-4'}>
						<div>
							<Card padding={'narrow'}>
								<label className={'component--switchCard-wrapper'}>
									<p className={'text-sm text-neutral-500 md:text-base'}>{'Dismissed'}</p>
									<Switch isEnabled={shouldDisplayDismissed} onSwitch={set_shouldDisplayDismissed} />
								</label>
							</Card>
						</div>
						<div>
							<AlertSelector
								selectedLevel={alertFilter}
								onSelect={(s): void => set_alertFilter((c): TAlertLevels => c === s ? 'none' : s)} />
						</div>
					</div>
				</div>
				<div className={'flex-col-full'}>
					<SectionAlertList
						shouldDisplayDismissed={shouldDisplayDismissed}
						stratOrVault={filteredStrategies} />
				</div>
			</div>
		</div>
	);
}

export default Alerts;
