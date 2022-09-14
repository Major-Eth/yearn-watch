import React, {MouseEvent, ReactElement} from 'react';
import Link from 'next/link';
import {TStrategy} from 'contexts/useWatch.d';
import {AddressWithActions, Button, Card, StatisticCard} from '@yearn-finance/web-lib/components';
import * as utils from '@yearn-finance/web-lib/utils';

type 		TStrategyBox = {
	strategy: TStrategy,
	decimals: number,
	vaultAddress: string
}
function	StrategyBox({
	strategy,
	decimals,
	vaultAddress
}: TStrategyBox): ReactElement {
	return (
		<Card variant={'background'} className={'mb-4'}>
			<div className={'flex-row-start justify-between md:items-center'}>
				<div>
					<b className={'mb-2'}>{strategy.name}</b>
					<p className={'text-xs text-neutral-500'}>
						{`Last report: ${strategy?.details.lastReport ? utils.format.since(Number(strategy.details.lastReport) * 1000) : 'never'}`}
					</p>
					<AddressWithActions
						address={strategy.address}
						truncate={3}
						wrapperClassName={'flex md:hidden mt-2'}
						className={'font-mono text-sm text-neutral-500'} />
				</div>
				<div className={'flex-row-center'}>
					<AddressWithActions
						address={strategy.address}
						wrapperClassName={'hidden md:flex'}
						className={'font-mono text-sm text-neutral-500'} />
					<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
						<Link passHref href={`/vault/${vaultAddress}/${strategy.address}`}>
							<Button
								as={'a'}
								variant={'outlined'}
								className={'mx-0 min-w-fit md:mr-10 md:ml-6 md:min-w-[132px]'}>
								<span className={'sr-only'}>{'Access details about this strategy'}</span>
								{'Details'}
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<div className={'my-6 w-full md:w-3/4'}>
				<p
					className={'text-sm'}
					dangerouslySetInnerHTML={{__html: utils.parseMarkdown((strategy?.description || '').replace(/{{token}}/g, strategy.vault.underlyingTokenSymbol) || '')}} />
			</div>
			<StatisticCard.Wrapper>
				<StatisticCard
					label={'Total debt'}
					className={'col-span-12 md:col-span-4'}
					value={utils.format.bigNumberAsAmount(utils.format.BN(strategy.details.totalDebt), decimals, 5)} />
				<StatisticCard
					label={'Credit available'}
					className={'col-span-12 md:col-span-4'}
					value={utils.format.bigNumberAsAmount(utils.format.BN(strategy.details.creditAvailable), decimals, 4)} />
				<StatisticCard
					label={'Total Estimated Assets'}
					className={'col-span-12 md:col-span-4'}
					value={utils.format.bigNumberAsAmount(utils.format.BN(strategy.details.estimatedTotalAssets), decimals, 4)} />
				<StatisticCard
					className={'col-span-6 md:col-span-4'}
					label={'Debt ratio'}
					value={utils.format.bigNumberAsAmount(utils.format.BN(strategy.details.debtRatio), 2, 2, '%')} />
				<StatisticCard
					className={'col-span-6 md:col-span-4'}
					label={'Average APR'}
					value={`${utils.format.amount((strategy?.details.apr || 0), 2)}%`} />
				<StatisticCard
					className={'col-span-6 md:col-span-4'}
					label={'Index'}
					value={utils.format.amount((strategy?.details?.withdrawalQueuePosition === 21 ? -1 : strategy?.details?.withdrawalQueuePosition || 0), 0, 0)} />
			</StatisticCard.Wrapper>
		</Card>
	);
}

export default StrategyBox;