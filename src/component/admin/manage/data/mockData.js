export const categories = [
    {
        id: 1,
        name: "Cơ sở dữ liệu sách",
        description: "Cơ sở dữ liệu sách",
        subcategories: [
          { id: 1, name: "Chăm sóc sức khỏe", description: "Chăm sóc sức khỏe", categoryId: 1 },
          { id: 2, name: "Ngoại ngữ", description: "Ngoại ngữ", categoryId: 1 },
          { id: 3, name: "Kinh tế", description: "Kinh tế", categoryId: 1 },
          { id: 4, name: "Du lịch", description: "Du lịch", categoryId: 1 },
          { id: 5, name: "Luật", description: "Luật", categoryId: 1 },
          { id: 6, name: "Giáo dục", description: "Giáo dục", categoryId: 1 },
          { id: 7, name: "Công nghệ kỹ thuật", description: "Công nghệ kỹ thuật", categoryId: 1 },
          { id: 14, name: "Khác", description: "Khác", categoryId: 1 },
        ]
      },
      {
        id: 2,
        name: "Nghiên cứu khoa học",
        description: "Nghiên cứu khoa học",
        subcategories: [
          { id: 12, name: "Đề tài khoa học", description: "Đề tài khoa học", categoryId: 2 },
          { id: 13, name: "Bài báo khoa học", description: "Bài báo khoa học", categoryId: 2 },
        ]
      },
      {
        id: 3,
        name: "Luận văn luận án",
        description: "Luận văn luận án",
        subcategories: [
          { id: 8, name: "Luận án tiến sĩ", description: "Luận án tiến sĩ", categoryId: 3 },
          { id: 9, name: "Luận văn Thạc sĩ", description: "Luận văn Thạc sĩ", categoryId: 3 },
        ]
      },
      {
        id: 4,
        name: "Đa phương tiện",
        description: "Đa phương tiện",
        subcategories: [
          { id: 10, name: "Video bài giảng", description: "Video bài giảng", categoryId: 4 },
          { id: 11, name: "Slides bài giảng", description: "Slides bài giảng", categoryId: 4 },
        ]
      },
];

export const books = [
    {
        id: 1,
        title: "1984",
        author: "by George Orwell",
        year: 1949,
        genre: "Science Fiction",
        rating: 4.3,
        imageUrl: "/placeholder.svg"
      },
      {
        id: 2,
        title: "Pride and Prejudice",
        author: "by Jane Austen",
        year: 1813,
        genre: "Romance",
        rating: 4.4,
        imageUrl: "/placeholder.svg"
      },
      {
        id: 3,
        title: "The Catcher in the Rye",
        author: "by J.D. Salinger",
        year: 1951,
        genre: "Fiction",
        rating: 4.0,
        imageUrl: "/placeholder.svg"
      },
      {
        id: 4,
        title: "The Great Gatsby",
        author: "by F. Scott Fitzgerald",
        year: 1925,
        genre: "Fiction",
        rating: 4.2,
        imageUrl: "/placeholder.svg"
      }
];