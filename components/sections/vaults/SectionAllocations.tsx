import React, {Fragment, ReactElement, memo, useState} from 'react';
import {Disclosure, Transition} from '@headlessui/react';
import {TStrategy, TVault} from 'contexts/useWatch.d';
import {Chevron} from '@yearn-finance/web-lib/icons';
import {useClientEffect} from '@yearn-finance/web-lib/hooks';
import {format}  from '@yearn-finance/web-lib/utils';

type	TSectionAllocations = {currentVault: TVault};
const	SectionAllocations = memo(function SectionAllocations({currentVault}: TSectionAllocations): ReactElement {
	type	TStateAllocation = {
		empty: TStrategy[],
		notEmpty: TStrategy[],
		protocolsAllocation: {[key: string]: number},
		totalProtocolsAllocation: number,
		notAllocated: number
	};
	const	[allocations, set_allocations] = useState<TStateAllocation>({
		empty: [],
		notEmpty: [],
		protocolsAllocation: {},
		totalProtocolsAllocation: 0,
		notAllocated: 0
	});

	/* 🔵 - Yearn Finance ******************************************************
	** The allocation of the vault is based on the total assets of the vault.
	** We have two arrays to work nicely with the UI, the Empty allocation, and
	** the Not Empty allocation. Everytime the currentVault changes, update
	** the allocations.
	**************************************************************************/
	useClientEffect((): (() => void) => {
		const	_strategies = currentVault.strategies.sort((a, b): number => (b?.details?.debtRatio || 0) - (a?.details?.debtRatio || 0));
		const	_empty = _strategies.filter((_strategy): boolean => (_strategy?.details?.debtRatio || 0) === 0);
		const	_notEmpty = _strategies.filter((_strategy): boolean => (_strategy?.details?.debtRatio || 0) !== 0);

		const	_protocolsAllocation: {[key: string]: number} = {};
		let		totalProtocolsAllocation = 0;
		for (const _strategy of _notEmpty) {
			if (_strategy?.details?.protocols) {
				for (const _protocol of _strategy?.details?.protocols || []) {
					_protocolsAllocation[_protocol] = (_protocolsAllocation[_protocol] || 0) + (_strategy?.details?.debtRatio || 0);
					totalProtocolsAllocation = totalProtocolsAllocation + (_strategy?.details?.debtRatio || 0);
				}
			}
		}

		set_allocations({
			empty: _empty,
			notEmpty: _notEmpty,
			protocolsAllocation: _protocolsAllocation,
			totalProtocolsAllocation,
			notAllocated: _notEmpty.reduce((acc, _strategy): number => acc + (_strategy?.details?.debtRatio || 0), 0)
		});
		return (): void => {
			set_allocations({
				empty: [],
				notEmpty: [],
				protocolsAllocation: {},
				totalProtocolsAllocation: 0,
				notAllocated: 0
			});
		};
	}, [currentVault]);
	
	return (
		<section
			aria-label={'vault-allocations'}
			className={'col-span-1'}>
			<div className={'flex flex-col'}>
				<h4 className={'mb-4'}>{'Protocols Allocation'}</h4>
				<div className={'space-y-4'}>
					{
						Object.entries(allocations.protocolsAllocation).map(([key, value]): ReactElement => {
							return <div className={'flex flex-col'} key={key}>
								<span className={'mb-2 flex flex-row items-center justify-between'}>
									<p className={'text-left text-neutral-500'}>{`${key}`}</p>
									<b className={'text-left text-accent-500'}>
										{`${format.amount(Number(value) / Number(allocations.totalProtocolsAllocation) * 100)}%`}
									</b>
								</span>
								<div>
									<div className={'relative h-2 w-full overflow-hidden rounded-2xl bg-neutral-200 transition-transform'}>
										<div className={'inset-y-0 left-0 h-full rounded-2xl bg-accent-500'} style={{width: `${Number(value) / Number(allocations.totalProtocolsAllocation) * 100}%`}} />
									</div>
								</div>
							</div>;
						})
					}
				</div>
			</div>

			<div className={'mt-8 flex flex-col'}>
				<h4 className={'mb-4'}>{'Strategy Allocation'}</h4>
				<div className={'space-y-4'}>
					<div className={'flex flex-col'}>
						<span className={'mb-2 flex flex-row items-center justify-between'}>
							<p className={'text-left text-neutral-500'}>{'Not Allocated'}</p>
							<b className={'text-left text-accent-500'}>
								{`${format.amount(100 - (allocations.notAllocated / 100), 2)}%`}
							</b>
						</span>
						<div>
							<div className={'relative h-2 w-full overflow-hidden rounded-2xl bg-neutral-200 transition-transform'}>
								<div
									className={'inset-y-0 left-0 h-full rounded-2xl bg-accent-500'}
									style={{width: `${100 - (allocations.notAllocated / 100)}%`}} />
							</div>
						</div>
					</div>
					{
						allocations.notEmpty.map((strategy: TStrategy): ReactElement => (
							<div className={'flex flex-col'} key={strategy.address}>
								<span className={'mb-2 flex flex-row items-center justify-between'}>
									<p className={'text-left text-neutral-500'}>{`${strategy.name}`}</p>
									<b className={'text-left text-accent-500'}>
										{`${format.amount(strategy?.details?.debtRatio / 100, 2)}%`}
									</b>
								</span>
								<div>
									<div className={'relative h-2 w-full overflow-hidden rounded-2xl bg-neutral-200 transition-transform'}>
										<div
											className={'inset-y-0 left-0 h-full rounded-2xl bg-accent-500'}
											style={{width: `${strategy?.details?.debtRatio / 100}%`}} />
									</div>
								</div>
							</div>
						))
					}
				</div>
				{(allocations?.empty || []).length > 0 ? 
					<div className={'mt-4 w-full'}>
						<Disclosure>
							{({open}): ReactElement => (
								<>
									<Disclosure.Button as={'div'} className={'w-full'}>
										<span className={'mb-2 flex w-full cursor-pointer flex-row items-center justify-between'}>
											<p className={'text-left text-neutral-500'}>{'Empty Allocations'}</p>
											<Chevron className={`h-4 w-4 text-accent-500 transition-transform${open ? '-rotate-90' : '-rotate-180'}`} />
										</span>
									</Disclosure.Button>
									<Transition
										as={Fragment}
										show={open}
										enter={'transition duration-100 ease-out origin-top'}
										enterFrom={'transform scale-y-0 opacity-0 origin-top'}
										enterTo={'transform scale-y-100 opacity-100 origin-top'}
										leave={'transition ease-out origin-top'}
										leaveFrom={'transform scale-y-100 opacity-100 origin-top'}
										leaveTo={'transform scale-y-0 opacity-0 origin-top'}>
										<Disclosure.Panel static className={'rounded-default w-full bg-neutral-100 py-2 px-4'}>
											{
												allocations.empty.map((strategy: TStrategy): ReactElement => (
													<div className={'flex flex-col'} key={strategy.address}>
														<span className={'mb-4 flex flex-row items-center justify-between md:mb-2'}>
															<p className={'break-all text-left text-neutral-500'}>{`${strategy.name}`}</p>
															<b className={'ml-4 text-left text-accent-500 md:ml-0'}>{'0%'}</b>
														</span>
													</div>
												))
											}
										</Disclosure.Panel>
									</Transition>
								</>	
							)}
						</Disclosure>
					</div>
					: null}
			</div>
		</section>
	);
});

export default SectionAllocations;