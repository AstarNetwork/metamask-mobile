import React from 'react';
import AssetOverview from './';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

const mockStore = configureMockStore();
const store = mockStore({});

describe('AssetOverview', () => {
	it('should render correctly', () => {
		const initialState = {
			settings: {
				primaryCurrency: 'ETH',
			},
		};
		const asset = {
			balance: 4,
			balanceFiat: 1500,
			logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
			symbol: 'ETH',
			name: 'Ethereum',
		};

		const wrapper = shallow(
			<Provider store={store}>
				<AssetOverview asset={asset} />
			</Provider>,
			{
				context: { store: mockStore(initialState) },
			}
		);
		expect(wrapper).toMatchSnapshot();
	});
});
