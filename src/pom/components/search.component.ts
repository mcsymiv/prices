import { IComponent, Component } from '@pom/base.page';

interface ISearch extends IComponent {
}

class Search extends Component implements ISearch {
}

export { Search, ISearch }
