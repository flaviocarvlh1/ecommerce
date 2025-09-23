import Link from "next/link";

type Category = {
  id: string | number;
  name: string;
  slug: string;
};

export default function CategoryListMenu({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <nav className="mt-4 space-y-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="block py-2 text-sm hover:text-blue-600"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
