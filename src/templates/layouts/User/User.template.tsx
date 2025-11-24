import React from 'react';
import { NavButton, NavItem, NavSeparator } from '@/components/layouts/Navigation/Nav';
import { appPages, authPages } from '@/config/pages.config';
import Icon from '@/components/icon/Icon';
import Badge from '@/components/ui/Badge';
import User from '@/components/layouts/User/User';
import { authClient } from '@/lib/auth-client';

const UserTemplate = () => {
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;

	return (
		<User
			isLoading={isPending}
			name={user?.name || user?.email?.split('@')[0] || 'User'}
			nameSuffix={user?.emailVerified && <Icon icon='HeroCheckBadge' color='blue' />}
			position={user?.role || 'Member'}
			src={user?.image}
			suffix={
				<Badge color='amber' variant='solid' className='text-xs font-bold'>
					PRO
				</Badge>
			}>
			<NavSeparator />
			<NavItem {...authPages.profilePage} />
			<NavItem {...appPages.mailAppPages.subPages.inboxPages}>
				<Badge variant='solid' className='leading-none'>
					3
				</Badge>
				<NavButton icon='HeroPlusCircle' title='New Mail' onClick={() => {}} />
			</NavItem>
			<NavItem
				text='Logout'
				icon='HeroArrowRightOnRectangle'
				onClick={() => authClient.signOut()}
			/>
		</User>
	);
};

export default UserTemplate;
