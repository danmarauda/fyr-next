import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Container from '@/components/layouts/Container/Container';
import Subheader, { SubheaderLeft } from '@/components/layouts/Subheader/Subheader';
import Card, { CardBody } from '@/components/ui/Card';

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
						<div className='rounded-lg border p-4'>
							<p className='text-gray-600'>
								Rich Text Editor component temporarily disabled.
							</p>
							<p className='mt-2 text-sm text-gray-500'>
								Please configure the @alias/plate package to enable the editor.
							</p>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default EditorPage;
