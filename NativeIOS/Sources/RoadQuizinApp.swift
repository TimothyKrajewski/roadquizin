import SwiftUI

struct Question: Codable {
    let prompt: String
    let options: [String]
    let answer: Int
    let fact: String
}

struct Quiz: Codable, Identifiable {
    let id: String
    let title: String
    let category: String
    let questions: [Question]
}

struct QuizResult: Codable, Identifiable {
    var id = UUID()
    let title: String
    let score: Int
    let total: Int
    let date: Date
}

@main
struct RoadQuizinApp: App {
    var body: some Scene {
        WindowGroup { RoadQuizinView() }
    }
}

struct RoadQuizinView: View {
    private let cream = Color(red: 0.97, green: 0.96, blue: 0.92)
    private let ink = Color(red: 0.10, green: 0.09, blue: 0.17)
    private let colors: [Color] = [.orange, .pink, .purple, .yellow, .mint, .red]
    private let categories = ["History", "Science", "Math & Logic", "Geography", "Sports", "Food & Drink", "Technology", "Nature", "Literature", "Entertainment", "Arts & Culture", "General Knowledge"]
    private let tabs = ["Explore", "Library", "Progress", "You"]
    private let symbols = ["safari.fill", "square.grid.2x2.fill", "chart.line.uptrend.xyaxis", "person.crop.circle.fill"]
    private let quizzes: [Quiz] = {
        guard let url = Bundle.main.url(forResource: "Quizzes", withExtension: "json"),
              let data = try? Data(contentsOf: url) else { return [] }
        return (try? JSONDecoder().decode([Quiz].self, from: data)) ?? []
    }()

    @AppStorage("quizResults") private var resultData = Data()
    @State private var tab = 0
    @State private var category: String?
    @State private var search = ""
    @State private var quiz: Quiz?
    @State private var index = 0
    @State private var choice: Int?
    @State private var score = 0
    @State private var showFact = false
    @State private var result: QuizResult?
    @State private var celebrate = false

    private var history: [QuizResult] {
        (try? JSONDecoder().decode([QuizResult].self, from: resultData)) ?? []
    }

    private var streak: Int {
        let calendar = Calendar.current
        let days = Set(history.map { calendar.startOfDay(for: $0.date) })
        var day = calendar.startOfDay(for: Date())
        if !days.contains(day) { day = calendar.date(byAdding: .day, value: -1, to: day) ?? day }
        var count = 0
        while days.contains(day) {
            count += 1
            guard let previous = calendar.date(byAdding: .day, value: -1, to: day) else { break }
            day = previous
        }
        return count
    }

    var body: some View {
        VStack(spacing: 0) {
            if let quiz {
                play(quiz)
            } else if let result {
                ScrollView {
                    VStack(alignment: .leading, spacing: 18) {
                        caption("QUIZ COMPLETE")
                        Text(result.title).font(.largeTitle.bold())
                        Text("\(result.score) / \(result.total)").font(.largeTitle.bold())
                        action("BACK TO QUIZZES") { self.result = nil }
                    }.padding()
                }
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 14) {
                        switch tab {
                        case 0:
                            if let category {
                                HStack {
                                    Button { self.category = nil } label: {
                                        Image(systemName: "chevron.left").frame(width: 40, height: 40)
                                    }.accessibilityLabel("Back to categories")
                                    Spacer()
                                    Text(category).font(.headline)
                                    Spacer()
                                    Color.clear.frame(width: 40, height: 1)
                                }
                                ForEach(quizzes.filter { $0.category == category }) { quizRow($0) }
                            } else {
                                explore
                            }
                        case 1:
                            Text("Library").font(.largeTitle.bold())
                            TextField("Search quizzes", text: $search).padding().background(.white, in: RoundedRectangle(cornerRadius: 14))
                            ForEach(quizzes.filter { search.isEmpty || $0.title.localizedCaseInsensitiveContains(search) }) { quizRow($0) }
                        case 2:
                            Text("Progress").font(.largeTitle.bold())
                            Text("\(history.count) runs completed · \(streak)-day streak")
                            if history.isEmpty { Text("Finish a quiz to see your results here.").foregroundStyle(.secondary) }
                            ForEach(history) { item in
                                HStack { Text(item.title).bold(); Spacer(); Text("\(item.score) / \(item.total)") }.quizCard()
                            }
                        default:
                            Text("You").font(.largeTitle.bold())
                            Label("RoadQuizin", systemImage: "person.crop.circle.fill").font(.title2.bold())
                            Text("Play offline. Your progress is saved on this device.")
                            action("VIEW PROGRESS") { tab = 2 }
                        }
                    }.padding(16)
                }.id("\(tab)-\(category ?? "")")
                HStack(spacing: 0) {
                    ForEach(tabs.indices, id: \.self) { i in
                        Button { tab = i; category = nil } label: {
                            VStack(spacing: 4) {
                                Image(systemName: symbols[i]).font(.system(size: 20))
                                Text(tabs[i]).font(.caption2.bold())
                            }.frame(maxWidth: .infinity).padding(.vertical, 6)
                                .background(tab == i ? Color.black.opacity(0.07) : .clear, in: Capsule())
                        }.accessibilityAddTraits(tab == i ? .isSelected : [])
                    }
                }.padding(5).background(.white.opacity(0.8), in: Capsule()).padding(.horizontal, 12)
            }
        }.background(cream.ignoresSafeArea()).foregroundStyle(ink)
            .buttonStyle(.plain).preferredColorScheme(.light)
    }

    private var explore: some View {
        Group {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 2) {
                    caption("GOOD MORNING")
                    Text("Ready for a\nbrain detour?").font(.system(size: 35, weight: .black, design: .rounded))
                }
                Spacer()
                Image(systemName: "brain.head.profile").font(.title2).foregroundStyle(.white)
                    .frame(width: 52, height: 52).background(ink, in: Circle()).accessibilityHidden(true)
            }
            if let games = quizzes.first(where: { $0.id == "Games" }) {
                Button { start(games) } label: {
                    VStack(alignment: .leading, spacing: 9) {
                        Text("FEATURED RUN").font(.caption2.bold()).tracking(2)
                        Spacer(minLength: 12)
                        Text("Games").font(.largeTitle.bold())
                        Text("A fresh way to flex your curiosity.").font(.footnote)
                        Text("START THE RUN  →").font(.caption2.bold()).tracking(1)
                    }.frame(maxWidth: .infinity, alignment: .leading).padding(20).foregroundStyle(.white)
                        .background(LinearGradient(colors: [Color(red: 0.75, green: 0.26, blue: 0.25), ink], startPoint: .topLeading, endPoint: .bottomTrailing), in: RoundedRectangle(cornerRadius: 23))
                }
            }
            caption("PLAY MODES")
            Button {
                let questions = Array(quizzes.flatMap(\.questions).shuffled().prefix(30))
                start(Quiz(id: "gauntlet", title: "The Gauntlet", category: "Gauntlet", questions: questions))
            } label: {
                HStack {
                    Image(systemName: "flame.fill").padding(9).background(.white.opacity(0.2), in: Circle())
                    VStack(alignment: .leading, spacing: 3) {
                        Text("THE GAUNTLET").font(.caption.bold()).tracking(1)
                        Text("Random questions. One life. How far can you go?").font(.caption2)
                    }
                    Spacer()
                    Image(systemName: "arrow.right.circle.fill")
                }.padding(14).foregroundStyle(.white)
                    .background(LinearGradient(colors: [.pink, .purple, .indigo], startPoint: .leading, endPoint: .trailing), in: RoundedRectangle(cornerRadius: 17))
            }
            caption("YOUR MOMENTUM")
            Text("\(streak)-day curiosity streak").font(.subheadline.bold()).frame(maxWidth: .infinity, alignment: .leading).quizCard()
            caption("PICK A CATEGORY")
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                ForEach(categories.indices, id: \.self) { i in
                    Button { category = categories[i] } label: {
                        VStack(alignment: .leading, spacing: 5) {
                            Image(systemName: "lightbulb.fill").foregroundStyle(colors[i % colors.count])
                            Spacer(minLength: 7)
                            Text(categories[i]).font(.subheadline.bold())
                            Text("\(quizzes.filter { $0.category == categories[i] }.count) quizzes").font(.caption2).foregroundStyle(.secondary)
                        }.frame(maxWidth: .infinity, alignment: .leading).quizCard()
                    }
                }
            }
        }
    }

    private func quizRow(_ quiz: Quiz) -> some View {
        Button { start(quiz) } label: {
            HStack(spacing: 13) {
                Image(systemName: "lightbulb.fill").foregroundStyle(.mint)
                    .frame(width: 32, height: 32).background(.mint.opacity(0.12), in: RoundedRectangle(cornerRadius: 9))
                VStack(alignment: .leading, spacing: 3) {
                    Text(quiz.title).bold()
                    Text("\(quiz.questions.count) questions").font(.caption2).foregroundStyle(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right").font(.caption2).foregroundStyle(.secondary)
            }.quizCard()
        }
    }

    private func play(_ quiz: Quiz) -> some View {
        let question = quiz.questions[index]
        let finished = index + 1 == quiz.questions.count || (quiz.id == "gauntlet" && choice != question.answer)
        return VStack(spacing: 10) {
            HStack {
                Button { self.quiz = nil; celebrate = false } label: {
                    Image(systemName: "xmark").frame(width: 36, height: 36).background(.white, in: Circle())
                }.accessibilityLabel("Exit quiz")
                Spacer()
                caption("\(index + 1) OF \(quiz.questions.count)")
            }.padding(.horizontal)
            ProgressView(value: Double(index + 1), total: Double(quiz.questions.count)).tint(.mint).padding(.horizontal)
            ScrollView {
                VStack(alignment: .leading, spacing: 10) {
                    caption(quiz.category.uppercased()).foregroundStyle(.green)
                    Text(question.prompt).font(.system(size: 29, weight: .black, design: .rounded))
                    ForEach(question.options.indices, id: \.self) { option in
                        Button {
                            guard choice == nil else { return }
                            choice = option
                            if option == question.answer {
                                score += 1
                                celebrate = true
                            } else if !question.fact.isEmpty {
                                showFact = true
                            }
                        } label: {
                            HStack(spacing: 10) {
                                Text(String(Array("ABCD")[option])).font(.caption.bold()).frame(width: 26, height: 26)
                                    .background(.black.opacity(0.05), in: Circle())
                                Text(question.options[option]).font(.subheadline.bold())
                                Spacer()
                                if choice != nil && option == question.answer {
                                    Image(systemName: "checkmark.circle.fill").foregroundStyle(.green)
                                } else if choice == option {
                                    Image(systemName: "xmark.circle.fill").foregroundStyle(.red)
                                }
                            }.quizCard(choice == nil ? .white : option == question.answer ? .mint.opacity(0.22) : choice == option ? .red.opacity(0.14) : .white)
                        }.disabled(choice != nil)
                    }
                }.padding(.horizontal).padding(.top, 12)
            }.id(index)
            if choice != nil {
                VStack(spacing: 10) {
                    if !question.fact.isEmpty {
                        Button { showFact = true } label: {
                            HStack {
                                Image(systemName: "lightbulb.fill").foregroundStyle(.green)
                                VStack(alignment: .leading) {
                                    caption("FUN FACT")
                                    Text(question.fact).font(.caption).lineLimit(3)
                                }
                                Spacer()
                                Image(systemName: "chevron.up.circle")
                            }.quizCard(.mint.opacity(0.22))
                        }
                    }
                    action(finished ? "SEE RESULTS" : "NEXT QUESTION") {
                        celebrate = false
                        if finished {
                            let completed = QuizResult(title: quiz.title, score: score, total: index + 1, date: Date())
                            if let data = try? JSONEncoder().encode([completed] + history) { resultData = data }
                            result = completed
                            self.quiz = nil
                        } else {
                            index += 1
                            choice = nil
                        }
                    }
                }.padding(.horizontal)
            }
        }.overlay(alignment: .top) {
            if celebrate { ConfettiBurst().id(index).allowsHitTesting(false).accessibilityHidden(true) }
        }.sheet(isPresented: $showFact) {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    HStack { Text("Fun fact").bold(); Spacer(); Button("Done") { showFact = false }.bold() }
                    Image(systemName: "lightbulb.fill").font(.largeTitle).foregroundStyle(.mint)
                    Text("A little more to know").font(.title.bold())
                    Text(question.fact)
                }.padding(24)
            }.frame(maxWidth: .infinity, maxHeight: .infinity).background(cream)
                .foregroundStyle(ink).presentationDetents([.medium, .large]).presentationDragIndicator(.visible)
        }
    }

    private func start(_ quiz: Quiz) {
        guard !quiz.questions.isEmpty else { return }
        index = 0
        score = 0
        choice = nil
        celebrate = false
        self.quiz = quiz
    }

    private func caption(_ text: String) -> some View {
        Text(text).font(.system(size: 10, weight: .bold)).tracking(1.5)
    }

    private func action(_ label: String, perform: @escaping () -> Void) -> some View {
        Button(action: perform) {
            Text(label).font(.caption.bold()).tracking(1).foregroundStyle(.white)
                .frame(maxWidth: .infinity).padding(16).background(ink, in: RoundedRectangle(cornerRadius: 15))
        }
    }
}

private struct ConfettiBurst: View {
    @State private var progress = 0.0
    private let colors: [Color] = [.pink, .mint, .orange, .purple, .yellow, .blue]

    var body: some View {
        GeometryReader { geometry in
            ForEach(0..<36) { i in
                let angle = Double(i) * 2.4
                let distance = Double(70 + (i * 19) % 125)
                Rectangle().fill(colors[i % colors.count]).frame(width: 5, height: 8)
                    .rotationEffect(.degrees(Double(i * 31) + progress * 180))
                    .position(x: geometry.size.width / 2 + cos(angle) * distance * progress,
                              y: 160 + sin(angle) * distance * progress + 100 * progress * progress)
                    .opacity(1 - progress)
            }
        }.onAppear { withAnimation(.easeOut(duration: 0.85)) { progress = 1 } }
    }
}

private extension View {
    func quizCard(_ color: Color = .white) -> some View {
        padding(13).background(color, in: RoundedRectangle(cornerRadius: 13))
    }
}
