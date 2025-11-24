import React from 'react';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Container from '@/components/layouts/Container/Container';
import Subheader, { SubheaderLeft } from '@/components/layouts/Subheader/Subheader';
import Card, { CardBody } from '@/components/ui/Card';
import { PlateEditor } from '@fyr/plate';

const EditorPage = () => {
	return (
		<PageWrapper>
			<Subheader>
				<SubheaderLeft>
					<h2 className='text-xl font-semibold'>Rich Text Editor</h2>
				</SubheaderLeft>
			</Subheader>
			<Container>
				<Card>
					<CardBody>
						<PlateEditor />
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default EditorPage;
