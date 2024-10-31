# Load data and clean it based on the requirements

# Load data from file (assuming it's saved as 'norwegian_words.txt')
with open('C:/Users/bassb/Documents/GitHub/WordBubble/myapp/src/data/OldWords/norwegian_words.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()



# Process each line and extract only the valid words
cleaned_words = []
for line in lines:
    columns = line.split('\t')  # Split by tab to access columns
    word = columns[2].strip()   # Get the word from the third column and remove whitespace
    
    # Only keep words longer than 5 characters and remove the leading "-"
    if len(word) > 4:
        if word[0] == "-":
            cleaned_words.append(word[1:])  # Remove the leading "-" and add to set
        else :
            cleaned_words.append(word)

cleaned_words = list(dict.fromkeys(cleaned_words))

# Write the cleaned words to a new file
with open('cleaned_norwegian_words.txt', 'w', encoding='utf-8') as output_file:
    for word in cleaned_words:
        output_file.write(word + '\n')

print("Cleaned word list saved to 'cleaned_norwegian_words.txt'")