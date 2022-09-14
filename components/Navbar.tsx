import React, {ReactElement, cloneElement} from 'react';
import type * as NavbarTypes from './Navbar.d';

function	NavbarMenuItem({option, selected}: NavbarTypes.TMenuItem): ReactElement {
	return (
		<div className={'group flex flex-row items-center'}>
			<div className={`mr-4 cursor-pointer py-1 transition-colors ${option.values.includes(selected) ? 'text-primary-500' : 'text-neutral-500 group-hover:text-primary-500'}`}>
				{option.icon ? (
					cloneElement(option.icon, {className: 'w-6 min-w-[1.5rem] h-6'})
				) : (
					<div className={'mr-4 h-6 w-6 min-w-[1.5rem] cursor-pointer py-1'} />
				)}
			</div>
			<p className={`cursor-pointer py-1 transition-colors ${option.values.includes(selected) ? 'text-primary-500' : 'text-neutral-500 group-hover:text-primary-500'}`}>
				{option.label}
			</p>
		</div>
	);
}

function	NavbarMenuSubItem({option, selected}: NavbarTypes.TMenuItem): ReactElement {
	return (
		<div className={'group flex flex-row items-center'}>
			<div className={'mr-4 h-6 w-6 min-w-[1.5rem] cursor-pointer py-1'} />
			<p className={`cursor-pointer py-1 transition-colors ${option.values.includes(selected) ? 'text-primary-500' : 'text-neutral-500 group-hover:text-primary-500'}`}>
				{option.label}
			</p>
		</div>
	);
}

function	Navbar({
	options,
	logo,
	title,
	selected,
	set_selected,
	children,
	wrapper,
	...props
}: NavbarTypes.TNavbar): ReactElement {
	return (
		<aside
			aria-label={'aside-navigation'}
			className={'relative top-0 w-auto min-w-full pt-0 md:sticky md:w-full md:min-w-[10rem] md:pt-9'}
			{...props}>
			<div
				aria-label={'dektop-navigation'}
				className={'hidden flex-col md:flex'}
				style={{height: 'calc(100vh - 4.50rem)'}}>
				<a href={'/'}>
					<div className={'flex cursor-pointer flex-row items-center'}>
						<span className={'sr-only'}>{'Home'}</span>
						<div className={title ? 'mr-4' : ''}>
							{cloneElement(logo)}
						</div>
						{title ? <h1 className={'lowercase'}>{title}</h1> : null}
					</div>
				</a>
				<nav className={'mt-12 flex max-h-[75vh] flex-col space-y-4 overflow-y-auto scrollbar-none'}>
					{options.map((option): ReactElement  => {
						if (wrapper) {
							return (
								<div key={option.route} className={'space-y-2'}>
									{cloneElement(
										wrapper,
										{href: option.route},
										<a><NavbarMenuItem option={option} selected={selected} /></a>
									)}
									{(option.options || [])?.map((subOption): ReactElement => (
										<div key={subOption.route}>
											{cloneElement(
												wrapper,
												{href: subOption.route},
												<a><NavbarMenuSubItem option={subOption} selected={selected} /></a>
											)}
										</div>
									))}
								</div>
							);
						}
						return (
							<div
								key={option.route}
								onClick={(): void => set_selected(option.route)}
								className={'space-y-2'}>
								<NavbarMenuItem option={option} selected={selected} />
								{(option.options || [])?.map((subOption): ReactElement => (
									<div
										key={subOption.route}
										onClick={(): void => set_selected(subOption.route)}>
										<NavbarMenuSubItem option={subOption} selected={selected} />
									</div>
								))}
							</div>
						);
					})}
				</nav>
				{children}
			</div>
		</aside>
	);
}

export default Navbar;