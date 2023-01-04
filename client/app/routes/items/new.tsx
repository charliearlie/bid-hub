import { gql, useMutation } from "@apollo/client";

// const ADD_ITEM = gql`
//   mutation addItem($name: String!, $description: String!, $price: String!, $imageUrl: String!, $conditon: String) {
//     addItem({ name: $name, description: $description, price: $price, imageUrl: $imageUrl, condition: $condition }) {
//       id
//       description
//       slug
//     }
// }
// `;

export default function NewItemRoute() {
  <div>
    <h3>Add a new item</h3>
    <form method="post">
      <div>
        <label>
          name: <input type="text" name="name" />
        </label>
      </div>
      <div>
        <label>
          Description: <input type="text" name="description" />
        </label>
      </div>
      <div>
        <label>
          Price: <input type="text" name="price" />
        </label>
      </div>
      <div>
        <label>
          Image Url: <input type="text" name="imageUrl" />
        </label>
      </div>
      <div>
        <label>
          Condition: <input type="text" name="name" />
        </label>
      </div>
    </form>
  </div>;
}
